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

const emailSchema = z.string().trim().email("Informe um e-mail válido.").max(255);

const RecuperarSenha = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    try {
      await supabase.auth.resetPasswordForEmail(parsed.data, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      });
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
              <CardTitle className="text-2xl font-bold">Esqueci minha senha</CardTitle>
              <CardDescription>
                Informe o e-mail corporativo cadastrado para receber o link de recuperação.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {enviado ? (
                <p className="text-sm text-muted-foreground">
                  Se o e-mail estiver cadastrado, você receberá em instantes um link para criar uma
                  nova senha.
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail corporativo</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="empresa@dominio.com.br"
                      required
                    />
                  </div>
                  <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                    {loading ? "Enviando..." : "ENVIAR E-MAIL DE RECUPERAÇÃO"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
          <div className="mt-4 text-center text-sm">
            <Link to="/area-cliente" className="text-primary hover:underline">
              Voltar para o login
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RecuperarSenha;
