import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const formatCpf = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

const formatCnpj = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
};

const PrimeiroAcesso = () => {
  const [tipo, setTipo] = useState<"pf" | "pj">("pj");
  const [documento, setDocumento] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const digits = documento.replace(/\D/g, "");
  const documentoValido = tipo === "pf" ? digits.length === 11 : digits.length === 14;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentoValido) {
      toast.error(
        tipo === "pf"
          ? "Informe um CPF válido com 11 dígitos."
          : "Informe um CNPJ válido com 14 dígitos.",
      );
      return;
    }
    setLoading(true);
    try {
      const userData: Record<string, string> = { whatsapp };
      userData[tipo === "pf" ? "cpf" : "cnpj"] = digits;
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: senha,
        options: {
          emailRedirectTo: `${window.location.origin}/area-cliente`,
          data: userData,
        },
      });
      if (error) {
        toast.error(
          error.message.includes("already registered")
            ? "Este e-mail já possui cadastro."
            : "Não foi possível concluir o cadastro.",
        );
        return;
      }
      if (data.user && (data.user.identities?.length ?? 0) === 0) {
        toast.error(
          "Este e-mail já possui cadastro. Faça login ou use \"Esqueci minha senha\".",
        );
        return;
      }
      setEnviado(true);
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
              <CardTitle className="text-2xl font-bold">Primeiro acesso</CardTitle>
              <CardDescription>
                Cadastre-se para acessar cursos, PDFs e simuladores.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {enviado ? (
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p>
                    Enviamos um e-mail de confirmação para <strong>{email}</strong>. Clique no
                    link recebido para ativar o acesso.
                  </p>
                  <Link to="/area-cliente">
                    <Button variant="hero" className="w-full">
                      Ir para o login
                    </Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={tipo === "pf" ? "hero" : "outline"}
                      onClick={() => {
                        setTipo("pf");
                        setDocumento("");
                      }}
                    >
                      Pessoa Física
                    </Button>
                    <Button
                      type="button"
                      variant={tipo === "pj" ? "hero" : "outline"}
                      onClick={() => {
                        setTipo("pj");
                        setDocumento("");
                      }}
                    >
                      Empresa (CNPJ)
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="documento">{tipo === "pf" ? "CPF" : "CNPJ"}</Label>
                    <Input
                      id="documento"
                      value={documento}
                      onChange={(e) =>
                        setDocumento(tipo === "pf" ? formatCpf(e.target.value) : formatCnpj(e.target.value))
                      }
                      placeholder={tipo === "pf" ? "000.000.000-00" : "00.000.000/0000-00"}
                      inputMode="numeric"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      {tipo === "pf" ? "E-mail" : "E-mail corporativo"}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="(00) 00000-0000"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="senha">Crie uma senha</Label>
                    <Input
                      id="senha"
                      type="password"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      placeholder="Mínimo de 6 caracteres"
                      maxLength={72}
                      required
                    />
                  </div>
                  <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                    {loading ? "Enviando..." : "CADASTRAR"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
          <div className="mt-4 text-center text-sm">
            <Link to="/area-cliente" className="text-primary hover:underline">
              Já tenho cadastro
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrimeiroAcesso;
