import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const urlParams = new URL(req.url).searchParams;
    let type = urlParams.get("type") ?? urlParams.get("topic");
    let paymentId = urlParams.get("data.id") ?? urlParams.get("id");

    const body = await req.json().catch(() => null);
    if (body && typeof body === "object") {
      if (typeof body.type === "string") type = body.type;
      if (body.data?.id != null) paymentId = String(body.data.id);
    }

    if (!paymentId || (type && !type.includes("payment"))) {
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const token = Deno.env.get("MERCADOPAGO_ACCESS_TOKEN");
    if (!token) {
      console.error("mercadopago-webhook: MERCADOPAGO_ACCESS_TOKEN ausente");
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!mpResponse.ok) {
      const details = await mpResponse.text();
      console.error(`mercadopago-webhook: consulta do pagamento falhou [${mpResponse.status}]: ${details}`);
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payment = await mpResponse.json();
    if (payment.status !== "approved" && payment.status !== "authorized") {
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const reference = String(payment.external_reference ?? "");
    const [userId, productId] = reference.split(":");
    if (!userId || !productId) {
      console.error("mercadopago-webhook: external_reference inválida:", reference);
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = Deno.env.get("SUPABASE_URL")!;
    const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { error: updateError } = await admin
      .from("client_purchases")
      .update({
        status: "paid",
        payment_id: String(paymentId),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .eq("product_id", productId);

    if (updateError) {
      console.error("mercadopago-webhook: falha ao liberar acesso:", updateError);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("mercadopago-webhook error:", e);
    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
