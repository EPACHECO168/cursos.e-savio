import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, PlayCircle, ShieldCheck, Calculator, ArrowRight, LogIn, CheckCircle2 } from "lucide-react";
import logoESavio from "@/assets/logo-esavio-new.png";
import Footer from "@/components/Footer";

const topicos = [
  "Fluxo inicial da Importação",
  "O que fazer se o produto tiver Regime Especial",
  "Definir o VA – Valor Aduaneiro",
  "Definir a Base de Cálculo do PIS/COFINS - Importação",
  "Definir a Base de Cálculo do Imposto de Importação",
  "Definir a Base de Cálculo do IPI - Importação",
  "Definir a Base de Cálculo do ICMS – Importação",
  "Aprender a calcular o ICMS-Importação por dentro",
  "O que muda com a Reforma Tributária (IVA Dual)",
  "Geração da DUIMP (Declaração Única de Importação)",
  "Canais do Processo de Importação (Verde, Amarelo e Vermelho)",
  "Fluxo final de liberação da DUIMP e da mercadoria",
];

const aulas = [
  "Importação para Executivos",
  "Índice de Basileia x Risco de Investimentos com Instituições Bancárias",
  "Importação para Analistas - Nível Técnico",
  "Reforma Tributária - IVA Dual",
];
<a href="/pdfs/Analise_Reforma_Tributaria_v_Final.pptx" download>
  Baixar apresentação final da Reforma Tributária
</a>
const Cursos = () => {
  useEffect(() => {
    document.title = "Cursos e-savio | Importação e Reforma Tributária";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <Link to="/cursos" className="flex items-center gap-2">
            <img src={logoESavio} alt="e-savio Cursos" className="w-12 h-12 object-contain" />
            <span className="text-2xl font-bold text-foreground">
              e-savio <span className="text-primary">Cursos</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#programa" className="text-foreground hover:text-primary transition-smooth">Programa</a>
            <a href="#aulas" className="text-foreground hover:text-primary transition-smooth">Vídeo aulas</a>
            <a href="#investimento" className="text-foreground hover:text-primary transition-smooth">Investimento</a>
          </nav>
          <Button asChild variant="hero" className="shadow-elegant">
            <Link to="/area-cliente"><LogIn className="mr-2 h-4 w-4" />Área do Cliente</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="course-panel pt-36 pb-24">
          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary-glow/40 bg-primary/20 px-4 py-1.5 text-sm font-medium">
                <BookOpen className="h-4 w-4" /> Treinamentos para Executivos e Analistas
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Importação com os efeitos da{" "}
                <span className="text-primary-glow">Reforma Tributária</span>
              </h1>
              <p className="text-lg opacity-80 max-w-xl">
                Domine o processo de importação, do fluxo inicial à liberação da mercadoria,
                com cálculos de tributos e as mudanças do IVA Dual (CBS/IBS).
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="hero" size="lg" className="shadow-glow">
                  <Link to="/area-cliente">Quero me inscrever <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button asChild variant="glass" size="lg">
                  <a href="#programa">Ver programa</a>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: FileText, t: "Biblioteca de PDF's", d: "Material completo para download" },
                { icon: PlayCircle, t: "Vídeo aulas", d: "Player protegido e responsivo" },
                { icon: ShieldCheck, t: "Acesso seguro", d: "Liberado após pagamento" },
                { icon: Calculator, t: "Simuladores", d: "Em breve" },
              ].map(({ icon: Icon, t, d }) => (
                <div key={t} className="rounded-2xl border border-primary-glow/20 bg-primary/10 p-6 backdrop-blur-sm hover:-translate-y-1 transition-smooth">
                  <Icon className="h-8 w-8 text-primary-glow mb-3" />
                  <h3 className="font-semibold">{t}</h3>
                  <p className="text-sm opacity-70">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        import { useState } from "react";

const Cursos = () => {
  const [tab, setTab] = useState("importacao");

  const topicosImportacao = [
    "Fluxo inicial da Importação",
    "O que fazer se o produto tiver Regime Especial",
    "Definir o VA – Valor Aduaneiro",
    "Definir a Base de Cálculo do PIS/COFINS - Importação",
    "Definir a Base de Cálculo do Imposto de Importação",
    "Definir a Base de Cálculo do IPI - Importação",
    "Definir a Base de Cálculo do ICMS – Importação",
    "Aprender a calcular o ICMS-Importação por dentro",
    "O que muda com a Reforma Tributária (IVA Dual)",
    "Geração da DUIMP (Declaração Única de Importação)",
    "Canais do Processo de Importação (Verde, Amarelo e Vermelho)",
    "Fluxo final de liberação da DUIMP e da mercadoria",
  ];

  const topicosReforma = [
    "Módulo I – Conceitos sobre IVA Dual, sujeitos Ativo e Passivo",
    "Módulo II – Cronograma do IVA Dual",
    "Módulo III – Princípios do Novo Sistema",
    "Módulo IV – Como funciona o IVA na prática",
    "Módulo V – Créditos Tributários",
    "Módulo VI – Split Payment",
    "Módulo VII – Portal Apuração Assistida",
    "Módulo VIII – Imposto Seletivo – 'Imposto do pecado'",
  ];

  return (
    <section id="programa" className="py-20 gradient-subtle">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Programas dos Cursos</h2>

        {/* Abas */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setTab("importacao")}
            className={`px-4 py-2 rounded ${tab === "importacao" ? "bg-primary text-white" : "bg-card text-foreground"}`}
          >
            Importação de Equipamentos
          </button>
          <button
            onClick={() => setTab("reforma")}
            className={`px-4 py-2 rounded ${tab === "reforma" ? "bg-primary text-white" : "bg-card text-foreground"}`}
          >
            Reforma Tributária - IVA Dual
          </button>
        </div>

        {/* Conteúdo da aba */}
        {tab === "importacao" && (
          <ol className="grid md:grid-cols-2 gap-4">
            {topicosImportacao.map((t, i) => (
              <li key={t} className="flex gap-3 rounded-xl border border-border bg-card p-4 shadow-elegant">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full gradient-primary text-primary-foreground text-sm font-bold">{i + 1}</span>
                <span className="text-card-foreground">{t}</span>
              </li>
            ))}
          </ol>
        )}

        {tab === "reforma" && (
          <ol className="grid md:grid-cols-2 gap-4">
            {topicosReforma.map((t, i) => (
              <li key={t} className="flex gap-3 rounded-xl border border-border bg-card p-4 shadow-elegant">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full gradient-primary text-primary-foreground text-sm font-bold">{i + 1}</span>
                <span className="text-card-foreground">{t}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
};


        {/* Aulas */}
        <section id="aulas" className="py-20">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">Vídeo aulas</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {aulas.map((a, i) => (
                <div key={a} className="group rounded-2xl border border-border bg-card p-6 hover:shadow-glow transition-smooth">
                  <PlayCircle className="h-10 w-10 text-primary mb-4 group-hover:scale-110 transition-smooth" />
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Aula {i + 1}</p>
                  <h3 className="font-semibold text-card-foreground">{a}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Investimento */}
        <section id="investimento" className="py-20 gradient-subtle">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="course-panel rounded-3xl p-10 text-center shadow-glow">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Valor do Investimento</h2>
              <p className="text-4xl font-bold text-primary-glow my-4">R$ 150,00</p>
              <p className="opacity-80">em 2x de R$ 75,00 sem juros no cartão</p>
              <p className="opacity-80 mb-8">ou com desconto no Pix: <strong>R$ 120,00</strong></p>
              <ul className="text-left space-y-2 mb-8 max-w-sm mx-auto">
                {["PDF completo para download", "Acesso às vídeo aulas", "Conteúdo atualizado com o IVA Dual"].map((b) => (
                  <li key={b} className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary-glow" />{b}</li>
                ))}
              </ul>
              <Button asChild variant="hero" size="lg" className="w-full sm:w-auto">
                <Link to="/area-cliente">Acessar a Área do Cliente <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Cursos;
