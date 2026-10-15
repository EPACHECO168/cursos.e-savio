import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const raw = String(body.documento ?? body.cnpj ?? "");
    const digits = raw.replace(/\D/g, "");
    const password = String(body.password ?? "");

    const isCpf = digits.length === 11;
    const isCnpj = digits.length === 14;
    if ((!isCpf && !isCnpj) || password.length < 6) {
      return new Response(
        JSON.stringify({ error: "CPF/CNPJ ou senha inválidos." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const url = Deno.env.get("SUPABASE_URL")!;
    const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const column = isCpf ? "cpf" : "cnpj";
    const { data: profile } = await admin
      .from("client_profiles")
      .select("email")
      .eq(column, digits)
      .maybeSingle();

    if (!profile?.email) {
      return new Response(
        JSON.stringify({ error: "CPF/CNPJ ou senha inválidos." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const anon = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data, error } = await anon.auth.signInWithPassword({
      email: profile.email,
      password,
    });

    if (error || !data.session) {
      return new Response(
        JSON.stringify({ error: "CPF/CNPJ ou senha inválidos." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (_e) {
    return new Response(
      JSON.stringify({ error: "Erro inesperado. Tente novamente." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
