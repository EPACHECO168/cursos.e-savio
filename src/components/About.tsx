import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, Target, Lightbulb } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Foco no Cliente",
      description: "Cada atendimento é personalizado para atender suas necessidades específicas."
    },
    {
      icon: Lightbulb,
      title: "Inovação Sustentável",
      description: "Sempre buscamos as melhores soluções em saúde e energia renovável."
    },
    {
      icon: Users,
      title: "Confiança e Qualidade",
      description: "Trabalhamos com transparência total e equipamentos de primeira linha."
    }
  ];

  const benefits = [
    "Equipamentos testados e certificados",
    "Entrega e retirada sem custo adicional", 
    "Higienização completa dos produtos",
    "Suporte técnico especializado 24/7",
    "Instalação profissional de painéis solares",
    "Garantia de qualidade em todos os serviços"
  ];

  return (
    <section id="about" className="py-20 gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block gradient-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
                💡 Sobre a e-savio
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Cuidando da Sua
                <span className="gradient-primary bg-clip-text text-transparent"> Saúde</span> e do
                <span className="gradient-primary bg-clip-text text-transparent"> Meio Ambiente</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Somos uma empresa especializada em aluguel de equipamentos médicos e soluções em energia solar. 
                Com mais de 10 anos de experiência, ajudamos pessoas a recuperar sua mobilidade e empresas 
                a ter um futuro mais sustentável.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>

            <Button variant="hero" size="lg" className="shadow-glow">
              Conheça Nossa Empresa
            </Button>
          </div>

          {/* Values Cards */}
          <div className="space-y-6">
            {values.map((value, index) => (
              <Card key={index} className="shadow-elegant hover:shadow-glow transition-smooth border-border bg-card group">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center flex-shrink-0 group-hover:shadow-glow transition-smooth">
                      <value.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-card-foreground">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;