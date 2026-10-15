import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SITE_URL = "https://savio-web-craft.lovable.app";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Faça login para comprar." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const url = Deno.env.get("SUPABASE_URL")!;
    const authClient = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userError } = await authClient.auth.getUser();
    const user = userData?.user;
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Sessão expirada. Entre novamente." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = await req.json();
    const { productId } = body;
    if (!productId || typeof productId !== "string") {
      return new Response(
        JSON.stringify({ error: "Produto inválido." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    // "pix" (R$ com desconto) ou "card" (valor cheio, 2x sem juros)
    const paymentMethod = body.paymentMethod === "card" ? "card" : "pix";

    const token = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");
    if (!token) {
      return new Response(
        JSON.stringify({ error: "Pagamentos ainda não configurados. Informe o token do Mercado Pago." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    // Diagnóstico: apenas o prefixo (nunca o valor do token).
    const isTestToken = token.startsWith("TEST-");
    console.log(`create-payment: token prefix=${isTestToken ? "TEST" : token.startsWith("APP_USR") ? "APP_USR" : "UNKNOWN"}`);

    const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: product } = await admin
      .from("digital_products")
      .select("id, title, description, price_pix, price_card_total, card_installments")
      .eq("id", productId)
      .eq("active", true)
      .maybeSingle();

    if (!product) {
      return new Response(
        JSON.stringify({ error: "Produto não encontrado." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Pix: preço com desconto, sem cartão. Cartão: valor cheio, parcelas limitadas (sem juros).
    const unitPrice = paymentMethod === "card" ? Number(product.price_card_total) : Number(product.price_pix);
    console.log(`create-payment: method=${paymentMethod} unitPrice=${unitPrice}`);
    const paymentMethods =
      paymentMethod === "card"
        ? {
            installments: Math.max(Number(product.card_installments) || 1, 1),
            excluded_payment_types: [{ id: "bank_transfer" }, { id: "ticket" }],
          }
        : {
            excluded_payment_types: [
              { id: "credit_card" },
              { id: "debit_card" },
              { id: "ticket" },
            ],
          };

    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: [
          {
            id: product.id,
            title: product.title,
            description: product.description.slice(0, 250),
            quantity: 1,
            unit_price: unitPrice,
            currency_id: "BRL",
          },
        ],
        payer: { email: user.email },
        external_reference: `${user.id}:${product.id}`,
        notification_url: `${url}/functions/v1/mercadopago-webhook`,
        payment_methods: paymentMethods,
        back_urls: {
          success: `${SITE_URL}/area-cliente/painel?status=sucesso`,
          pending: `${SITE_URL}/area-cliente/painel?status=pendente`,
          failure: `${SITE_URL}/area-cliente/painel?status=falha`,
        },
        auto_return: "approved",
      }),
    });

    if (!mpResponse.ok) {
      const details = await mpResponse.text();
      console.error(`Mercado Pago preference failed [${mpResponse.status}]: ${details}`);
      return new Response(
        JSON.stringify({ error: "Falha ao criar o pagamento no Mercado Pago.", status: mpResponse.status, details }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const preference = await mpResponse.json();

    await admin.from("client_purchases").upsert(
      {
        user_id: user.id,
        product_id: product.id,
        status: "pending",
        preference_id: String(preference.id ?? ""),
      },
      { onConflict: "user_id,product_id" },
    );

    return new Response(
      JSON.stringify({
        initPoint: isTestToken
          ? (preference.sandbox_init_point ?? preference.init_point ?? null)
          : (preference.init_point ?? preference.sandbox_init_point ?? null),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("create-payment error:", e);
    return new Response(
      JSON.stringify({ error: "Erro inesperado. Tente novamente." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
