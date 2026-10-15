import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import solarPanels1 from "@/assets/solar-panels-1.jpg";
import cadeiraDeRodas from "@/assets/cadeira-de-rodas.jpg";

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center gradient-subtle pt-20">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block gradient-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-elegant">
                🏥 Saúde & Sustentabilidade
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Equipamentos & Eventos
                <span className="gradient-primary bg-clip-text text-transparent"> & Energia Solar</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                Oferecemos aluguel de equipamentos médicos, artigos para eventos e soluções completas 
                em energia solar para sua casa ou empresa.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="shadow-glow">
                Solicitar Orçamento
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="glass" size="lg" className="shadow-elegant" onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}>
                <Play className="mr-2 h-5 w-5" />
                Ver Catálogo
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Equipamentos Alugados</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10+</div>
                <div className="text-sm text-muted-foreground">Anos de Experiência</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Satisfação Garantida</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src={heroImage}
                alt="Equipamentos médicos e painéis solares e-savio"
                className="w-full h-auto rounded-2xl shadow-elegant"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 gradient-primary rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-glow rounded-full opacity-10 blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;