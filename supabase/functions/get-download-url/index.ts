import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Faça login para baixar o material." }),
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

    const { productId } = await req.json();
    if (!productId || typeof productId !== "string") {
      return new Response(
        JSON.stringify({ error: "Produto inválido." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: purchase } = await admin
      .from("client_purchases")
      .select("status")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .maybeSingle();

    if (!purchase || purchase.status !== "paid") {
      return new Response(
        JSON.stringify({ error: "Compra ainda não confirmada." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { data: product } = await admin
      .from("digital_products")
      .select("pdf_path")
      .eq("id", productId)
      .maybeSingle();

    if (!product?.pdf_path) {
      return new Response(
        JSON.stringify({ error: "Material não disponível." }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { data: signed, error: signedError } = await admin.storage
      .from("materiais-cursos")
      .createSignedUrl(product.pdf_path, 3600);

    if (signedError || !signed?.signedUrl) {
      console.error("get-download-url: falha ao gerar link:", signedError);
      return new Response(
        JSON.stringify({ error: "Não foi possível gerar o download." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ signedUrl: signed.signedUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("get-download-url error:", e);
    return new Response(
      JSON.stringify({ error: "Erro inesperado. Tente novamente." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
