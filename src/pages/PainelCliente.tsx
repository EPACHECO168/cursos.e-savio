import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  BookOpen,
  Calculator,
  Download,
  FileText,
  Lock,
  PlayCircle,
  QrCode,
  ShoppingCart,
  User,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import qrcodePixAsset from "@/assets/qrcode-pix-esavio.png.asset.json";

type ProdutoDigital = {
  id: string;
  slug: string;
  title: string;
  description: string;
  topicos: string[];
  price_pix: number;
  price_card_total: number;
  card_installments: number;
  pdf_path: string | null;
};

type Compra = { product_id: string; status: string };

type Perfil = { cnpj: string | null; cpf: string | null; email: string; whatsapp: string | null };

const formatCnpj = (v: string) =>
  v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");

const formatCpf = (v: string) =>
  v.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");

const formatWhatsapp = (v: string) =>
  v.replace(/^(\d{2})(\d{4,5})(\d{4})$/, "($1) $2-$3");

const AULAS = [
  {
    titulo: "Importação para Executivos",
    descricao:
      "Visão macro do processo de importação, governança e tomada de decisão estratégica para executivos.",
  },
  {
    titulo: "Índice de Basileia x Risco de Investimentos com instituições bancárias",
    descricao:
      "Alavancagem, solidez financeira e mitigação de risco com contrapartes bancárias.",
  },
  {
    titulo: "Importação para Analistas - Nível Técnico",
    descricao:
      "Detalhamento operacional, cálculo de impostos por dentro, regimes especiais e parametrização.",
  },
  {
    titulo: "Reforma Tributária - IVA Dual",
    descricao:
      "Transição para CBS/IBS, extinção de PIS/COFINS e IPI e impactos no custo de importação.",
  },
];

// Player demonstrativo temporário (formato iframe pronto para o Panda Video).
const DEMO_EMBED_URL = "https://www.w3schools.com/html/mov_bbb.mp4";

const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const PainelCliente = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [produtos, setProdutos] = useState<ProdutoDigital[]>([]);
  const [compras, setCompras] = useState<Compra[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [aba, setAba] = useState<"cursos" | "simuladores" | "dados">("cursos");
  const [subAba, setSubAba] = useState<"pdfs" | "videos">("pdfs");
  const [aulaAtiva, setAulaAtiva] = useState(0);
  const [comprando, setComprando] = useState<string | null>(null);
  const [pixProduto, setPixProduto] = useState<ProdutoDigital | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const carregarDados = useCallback(async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      navigate("/area-cliente", { replace: true });
      return;
    }
    supabase
      .rpc("has_role", { _user_id: userData.user.id, _role: "admin" })
      .then(({ data }) => setIsAdmin(!!data));

    const [{ data: perfilData }, { data: produtosData }, { data: comprasData }] =
      await Promise.all([
        supabase
          .from("client_profiles")
          .select("cnpj, cpf, email, whatsapp")
          .eq("user_id", userData.user.id)
          .maybeSingle(),
        supabase.from("digital_products").select("*").eq("active", true).order("created_at"),
        supabase
          .from("client_purchases")
          .select("product_id, status")
          .eq("user_id", userData.user.id),
      ]);

    setPerfil(
      perfilData ?? {
        cnpj: null,
        cpf: null,
        email: userData.user.email ?? "",
        whatsapp: null,
      },
    );
    setProdutos((produtosData as ProdutoDigital[]) ?? []);
    setCompras((comprasData as Compra[]) ?? []);
    setCarregando(false);
  }, [navigate]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "sucesso") {
      toast.success("Pagamento confirmado! Seu material já está liberado.");
    } else if (status === "pendente") {
      toast.info("Pagamento em processamento. Assim que confirmar, o acesso é liberado.");
    } else if (status === "falha") {
      toast.error("O pagamento não foi concluído. Tente novamente.");
    }
    if (status) {
      searchParams.delete("status");
      setSearchParams(searchParams, { replace: true });
      carregarDados();
    }
  }, [searchParams, setSearchParams, carregarDados]);

  const estaPago = (productId: string) =>
    compras.find((c) => c.product_id === productId)?.status === "paid";

  const comprar = async (productId: string, paymentMethod: "pix" | "card") => {
    if (paymentMethod === "pix") {
      const produto = produtos.find((p) => p.id === productId) ?? null;
      setPixProduto(produto);
      return;
    }
    setComprando(`${productId}:${paymentMethod}`);
    try {
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: { productId, paymentMethod },
      });
      if (error || !data?.initPoint) {
        toast.error(
          "Não foi possível iniciar o pagamento. Verifique se o token do Mercado Pago já foi configurado.",
        );
        return;
      }
      window.location.href = data.initPoint as string;
    } finally {
      setComprando(null);
    }
  };

  const baixar = async (productId: string) => {
    const { data, error } = await supabase.functions.invoke("get-download-url", {
      body: { productId },
    });
    if (error || !data?.signedUrl) {
      toast.error("Download indisponível. A confirmação do pagamento pode ainda estar em processamento.");
      return;
    }
    window.open(data.signedUrl as string, "_blank");
  };

  const sair = async () => {
    await supabase.auth.signOut();
    navigate("/area-cliente", { replace: true });
  };

  const abas = [
    { id: "cursos" as const, label: "Meus Cursos", icon: BookOpen },
    { id: "simuladores" as const, label: "Simuladores", icon: Calculator },
    { id: "dados" as const, label: "Meus Dados", icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 pt-32 pb-16">
        <h1 className="text-3xl font-bold mb-2">Área do Cliente</h1>
        <p className="text-muted-foreground mb-6">
          Cursos, materiais e ferramentas exclusivas para você.
        </p>

        {/* Abas principais */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {abas.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={aba === id ? "hero" : "outline"}
              onClick={() => setAba(id)}
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </Button>
          ))}
          {isAdmin && (
            <Button variant="secondary" onClick={() => navigate("/admin")}>
              Administração
            </Button>
          )}
        </div>

        {carregando ? (
          <p className="text-muted-foreground">Carregando...</p>
        ) : aba === "cursos" ? (
          <>
            {/* Sub-abas de Meus Cursos */}
            <div className="flex gap-2 mb-6">
              <Button
                variant={subAba === "pdfs" ? "secondary" : "ghost"}
                onClick={() => setSubAba("pdfs")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Biblioteca de PDF's
              </Button>
              <Button
                variant={subAba === "videos" ? "secondary" : "ghost"}
                onClick={() => setSubAba("videos")}
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Vídeo aulas
              </Button>
            </div>

            {subAba === "pdfs" ? (
              <div className="space-y-6">
                {produtos.length === 0 && (
                  <p className="text-muted-foreground">
                    Nenhum material disponível no momento.
                  </p>
                )}
                {produtos.map((produto) => {
                  const pago = estaPago(produto.id);
                  const valorParcela =
                    produto.price_card_total / Math.max(produto.card_installments, 1);
                  return (
                    <Card key={produto.id} className="shadow-elegant border-border">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div>
                            <CardTitle className="text-xl font-bold">{produto.title}</CardTitle>
                            <CardDescription className="mt-1">
                              Material digital completo em PDF
                            </CardDescription>
                          </div>
                          <Badge variant={pago ? "default" : "secondary"}>
                            {pago ? "Liberado" : "Disponível para compra"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-5">
                        <p className="text-sm text-muted-foreground">{produto.description}</p>

                        <div className="panel-navy rounded-lg p-5">
                          <p className="font-bold text-sm mb-3">
                            Por onde começa o Processo de Importação — o que você vai aprender:
                          </p>
                          <ol className="list-decimal list-inside space-y-2 text-sm text-justify">
                            {produto.topicos.map((topico) => (
                              <li key={topico}>
                                {topico
                                  .replace(/Definição da\b/g, "Definir a")
                                  .replace(/Definição do\b/g, "Definir o")}
                              </li>
                            ))}
                          </ol>
                        </div>

                        <div className="rounded-lg border border-border p-4 space-y-1 text-sm">
                          <p>
                            <span className="font-semibold">Valor do Investimento:</span>{" "}
                            <span className="font-semibold">
                              {formatBRL(Number(produto.price_card_total))} em{" "}
                              {produto.card_installments}x de{" "}
                              {formatBRL(Number(valorParcela))} sem juros
                            </span>
                            , ou desconto no Pix{" "}
                            <span className="font-semibold">
                              {formatBRL(Number(produto.price_pix))}
                            </span>
                            .
                          </p>
                        </div>

                        {pago ? (
                          <Button
                            variant="hero"
                            onClick={() => baixar(produto.id)}
                            className="w-full sm:w-auto"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Baixar Material Completo (PDF)
                          </Button>
                        ) : (
                          <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                              variant="hero"
                              onClick={() => comprar(produto.id, "card")}
                              disabled={comprando !== null}
                              className="w-full sm:w-auto"
                            >
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              {comprando === `${produto.id}:card`
                                ? "Abrindo pagamento..."
                                : `Comprar no Cartão — ${formatBRL(Number(produto.price_card_total))} em ${produto.card_installments}x de ${formatBRL(Number(valorParcela))} sem juros`}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => comprar(produto.id, "pix")}
                              disabled={comprando !== null}
                              className="w-full sm:w-auto"
                            >
                              <QrCode className="h-4 w-4 mr-2" />
                              {`Comprar no Pix — ${formatBRL(Number(produto.price_pix))} (com desconto)`}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <div>
                  <div className="aspect-video w-full rounded-lg overflow-hidden border border-border bg-muted">
                    <iframe
                      src={DEMO_EMBED_URL}
                      title={AULAS[aulaAtiva]?.titulo}
                      className="w-full h-full"
                      allow="autoplay; fullscreen; encrypted-media"
                      allowFullScreen
                    />
                  </div>
                  <p className="mt-3 text-sm font-semibold">{AULAS[aulaAtiva]?.titulo}</p>
                  <p className="text-sm text-muted-foreground">{AULAS[aulaAtiva]?.descricao}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Player demonstrativo — o player seguro do Panda Video será conectado aqui
                    assim que os links de incorporação forem fornecidos.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-sm mb-2">Suas aulas</p>
                  {AULAS.map((aula, index) => (
                    <button
                      key={aula.titulo}
                      onClick={() => setAulaAtiva(index)}
                      className={`w-full text-left rounded-lg border p-3 transition-smooth ${
                        index === aulaAtiva
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <p className="text-sm font-medium">
                        {index + 1}. {aula.titulo}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{aula.descricao}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : aba === "simuladores" ? (
          <Card className="max-w-xl border-border">
            <CardContent className="py-12 flex flex-col items-center text-center gap-3">
              <Lock className="h-10 w-10 text-muted-foreground" />
              <p className="font-semibold">Em breve</p>
              <p className="text-sm text-muted-foreground">
                Ferramentas exclusivas de simulação tributária e aduaneira estão sendo
                preparadas para você.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-2xl shadow-elegant border-border">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Meus Dados</CardTitle>
              <CardDescription>Dados cadastrais da sua conta.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                {perfil?.cnpj && (
                  <p>
                    <span className="text-muted-foreground">CNPJ: </span>
                    <span className="font-medium">{formatCnpj(perfil.cnpj)}</span>
                  </p>
                )}
                {perfil?.cpf && (
                  <p>
                    <span className="text-muted-foreground">CPF: </span>
                    <span className="font-medium">{formatCpf(perfil.cpf)}</span>
                  </p>
                )}
                <p>
                  <span className="text-muted-foreground">E-mail: </span>
                  <span className="font-medium">{perfil?.email}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">WhatsApp: </span>
                  <span className="font-medium">
                    {perfil?.whatsapp ? formatWhatsapp(perfil.whatsapp) : "-"}
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {isAdmin && (
                  <Button onClick={() => navigate("/admin")}>Administração</Button>
                )}
                <Button variant="outline" onClick={sair}>
                  Sair
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />

      {/* Pagamento via Pix — fora do Mercado Pago */}
      <Dialog open={pixProduto !== null} onOpenChange={(open) => !open && setPixProduto(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pagamento via Pix</DialogTitle>
            <DialogDescription>
              {pixProduto
                ? `${pixProduto.title} — ${formatBRL(Number(pixProduto.price_pix))} (com desconto)`
                : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <img
              src={qrcodePixAsset.url}
              alt="QR Code Pix e-savio"
              className="w-full max-w-xs rounded-lg border border-border"
            />
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground self-start">
              <li>Abra o aplicativo do seu banco e escolha pagar com Pix.</li>
              <li>Aponte a câmera para o QR Code acima e confirme o valor.</li>
              <li>Envie o comprovante pelo WhatsApp para liberarmos seu acesso.</li>
            </ol>
            <Button
              variant="hero"
              className="w-full"
              onClick={() =>
                window.open(
                  `https://wa.me/5514997519972?text=${encodeURIComponent(
                    `Olá! Fiz o pagamento via Pix do material "${pixProduto?.title ?? ""}" e segue o comprovante.`,
                  )}`,
                  "_blank",
                )
              }
            >
              Enviar comprovante pelo WhatsApp
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Assim que confirmarmos o pagamento, o download do material é liberado aqui no seu painel.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PainelCliente;
