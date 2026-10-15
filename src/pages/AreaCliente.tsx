import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const formatDocumento = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
};

const AreaCliente = () => {
  const navigate = useNavigate();
  const [documento, setDocumento] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/area-cliente/painel", { replace: true });
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = documento.replace(/\D/g, "");
    if (digits.length !== 11 && digits.length !== 14) {
      toast.error("Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("login-cnpj", {
        body: { documento: digits, password: senha },
      });
      if (error || !data?.access_token) {
        toast.error("CPF/CNPJ ou senha inválidos.");
        return;
      }
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });
      if (sessionError) {
        toast.error("Não foi possível iniciar a sessão.");
        return;
      }
      toast.success("Bem-vindo de volta!");
      navigate("/area-cliente/painel", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 pt-32 pb-16">
        <div className="w-full max-w-md">
          <Card className="shadow-elegant border-border">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Área do Cliente</CardTitle>
              <CardDescription>
                Acesse com o CPF ou o CNPJ cadastrado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="documento">CPF ou CNPJ</Label>
                  <Input
                    id="documento"
                    value={documento}
                    onChange={(e) => setDocumento(formatDocumento(e.target.value))}
                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                    inputMode="numeric"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Sua senha"
                    maxLength={72}
                    required
                  />
                </div>
                <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                  {loading ? "Entrando..." : "ENTRAR"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-4 flex flex-col items-center gap-2 text-sm">
            <Link to="/area-cliente/recuperar-senha" className="text-primary hover:underline">
              Esqueci minha senha
            </Link>
            <Link to="/area-cliente/primeiro-acesso" className="text-primary hover:underline">
              Primeiro acesso
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AreaCliente;
