import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Perfil = { user_id: string; email: string; cpf: string | null; cnpj: string | null; whatsapp: string | null; created_at: string };
type Produto = { id: string; title: string };
type Compra = { id: string; user_id: string; product_id: string; status: string };

const Admin = () => {
  const navigate = useNavigate();
  const [estado, setEstado] = useState<"carregando" | "negado" | "ok">("carregando");
  const [perfis, setPerfis] = useState<Perfil[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [compras, setCompras] = useState<Compra[]>([]);
  const [busca, setBusca] = useState("");
  const [salvando, setSalvando] = useState<string | null>(null);

  const carregar = async () => {
    const [p, d, c] = await Promise.all([
      supabase.from("client_profiles").select("user_id,email,cpf,cnpj,whatsapp,created_at").order("created_at", { ascending: false }),
      supabase.from("digital_products").select("id,title"),
      supabase.from("client_purchases").select("id,user_id,product_id,status"),
    ]);
    setPerfis(p.data ?? []);
    setProdutos(d.data ?? []);
    setCompras(c.data ?? []);
  };

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return navigate("/area-cliente");
      const { data: ok } = await supabase.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
      if (!ok) return setEstado("negado");
      setEstado("ok");
      carregar();
    })();
  }, [navigate]);

  const alterar = async (userId: string, productId: string, liberar: boolean) => {
    const chave = `${userId}:${productId}`;
    setSalvando(chave);
    const existente = compras.find((c) => c.user_id === userId && c.product_id === productId);
    const status = liberar ? "paid" : "pending";
    const { error } = existente
      ? await supabase.from("client_purchases").update({ status, updated_at: new Date().toISOString() }).eq("id", existente.id)
      : await supabase.from("client_purchases").insert({ user_id: userId, product_id: productId, status });
    setSalvando(null);
    if (error) return toast.error("Não foi possível salvar: " + error.message);
    toast.success(liberar ? "Acesso liberado!" : "Acesso bloqueado.");
    carregar();
  };

  const filtrados = useMemo(() => {
    const q = busca.toLowerCase().replace(/\D/g, "") || busca.toLowerCase();
    return perfis.filter((p) =>
      !busca || p.email.toLowerCase().includes(busca.toLowerCase()) || (p.cpf ?? "").includes(q) || (p.cnpj ?? "").includes(q)
    );
  }, [perfis, busca]);

  if (estado === "carregando") return <div className="p-10 text-center text-muted-foreground">Carregando...</div>;
  if (estado === "negado")
    return (
      <div className="p-10 text-center space-y-4">
        <p>Acesso restrito ao administrador.</p>
        <Button onClick={() => navigate("/area-cliente/painel")}>Voltar ao painel</Button>
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <header className="course-panel px-6 py-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">Administração — Liberação de Materiais</h1>
          <Button variant="secondary" onClick={() => navigate("/area-cliente/painel")}>Voltar ao painel</Button>
        </div>
      </header>
      <main className="max-w-5xl mx-auto p-6 space-y-4">
        <Input placeholder="Buscar por e-mail, CPF ou CNPJ" value={busca} onChange={(e) => setBusca(e.target.value)} />
        {filtrados.length === 0 && <p className="text-muted-foreground">Nenhum cliente encontrado.</p>}
        {filtrados.map((p) => (
          <div key={p.user_id} className="border rounded-lg p-4 bg-card space-y-3">
            <div>
              <p className="font-semibold break-all">{p.email}</p>
              <p className="text-sm text-muted-foreground">
                {p.cpf ? `CPF ${p.cpf}` : p.cnpj ? `CNPJ ${p.cnpj}` : "Sem documento"}
                {p.whatsapp ? ` · WhatsApp ${p.whatsapp}` : ""} · desde {new Date(p.created_at).toLocaleDateString("pt-BR")}
              </p>
            </div>
            {produtos.map((prod) => {
              const pago = compras.some((c) => c.user_id === p.user_id && c.product_id === prod.id && c.status === "paid");
              const chave = `${p.user_id}:${prod.id}`;
              return (
                <div key={prod.id} className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{prod.title}</span>
                    <Badge variant={pago ? "default" : "outline"}>{pago ? "Liberado" : "Não liberado"}</Badge>
                  </div>
                  <Button size="sm" variant={pago ? "outline" : "default"} disabled={salvando === chave}
                    onClick={() => alterar(p.user_id, prod.id, !pago)}>
                    {pago ? "Bloquear acesso" : "Liberar acesso"}
                  </Button>
                </div>
              );
            })}
          </div>
        ))}
      </main>
    </div>
  );
};

export default Admin;
