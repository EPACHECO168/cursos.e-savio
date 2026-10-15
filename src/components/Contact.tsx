import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "esavio.contato@gmail.com",
      description: "Respondemos em até 2h"
    },
    {
      icon: Phone,
      title: "WhatsApp",
      value: "+55 (14) 99751-9972",
      description: "Atendimento 24h"
    },
    {
      icon: MapPin,
      title: "Localização",
      value: "Uberlândia - MG",
      description: "Entregamos em toda região"
    },
    {
      icon: Clock,
      title: "Funcionamento",
      value: "24/7 Emergências",
      description: "Suporte sempre disponível"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block gradient-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
            📞 Entre em Contato
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Precisa de Equipamentos ou
            <span className="gradient-primary bg-clip-text text-transparent"> Energia Solar?</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Entre em contato conosco para aluguel de equipamentos médicos ou orçamento de painéis solares. 
            Estamos aqui para ajudar!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-elegant border-border bg-card">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-card-foreground">
                Envie uma Mensagem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-card-foreground">Nome</label>
                  <Input placeholder="Seu nome completo" className="transition-smooth" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-card-foreground">Email</label>
                  <Input type="email" placeholder="seu@email.com" className="transition-smooth" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Assunto</label>
                <Input placeholder="Aluguel de equipamento ou orçamento solar?" className="transition-smooth" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Mensagem</label>
                <Textarea 
                  placeholder="Descreva qual equipamento precisa ou tipo de instalação solar..."
                  className="min-h-[120px] transition-smooth"
                />
              </div>
              <Button variant="hero" size="lg" className="w-full shadow-glow" asChild>
                <a href="mailto:esavio.contato@gmail.com">
                  Enviar Mensagem
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="shadow-elegant hover:shadow-glow transition-smooth border-border bg-card group">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center flex-shrink-0 group-hover:shadow-glow transition-smooth">
                      <info.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-card-foreground">{info.title}</h3>
                      {info.title === "Email" ? (
                        <a 
                          href={`mailto:${info.value}`} 
                          className="text-primary font-medium hover:underline"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <p className="text-primary font-medium">{info.value}</p>
                      )}
                      <p className="text-sm text-muted-foreground">{info.description}</p>
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

export default Contact;