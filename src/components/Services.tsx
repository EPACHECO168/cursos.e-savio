import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Sun, Wrench, Truck, Shield, HeadphonesIcon, PartyPopper, ChevronRight, ChevronDown, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import solarPanels1 from "@/assets/solar-panels-1.jpg";
import solarInstallation from "@/assets/solar-installation.jpg";
import solarPanelsClose from "@/assets/solar-panels-close.jpg";
import cadeirasMesas from "@/assets/cadeiras-mesas.jpg";
import cadeirasMesas2 from "@/assets/cadeiras-mesas-2.jpg";
import tendasCoberturas from "@/assets/tendas-coberturas.jpg";
import tendasCoberturas2 from "@/assets/tendas-coberturas-2.jpg";
import equipamentosSom from "@/assets/equipamentos-som.jpg";
import equipamentosSom2 from "@/assets/equipamentos-som-2.jpg";

const Services = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const { addToCart } = useCart();
  
  const services = [
    {
      icon: Heart,
      title: "Cadeiras de Rodas",
      description: "Aluguel de cadeiras de rodas manuais e elétricas, com diferentes modelos para cada necessidade.",
      features: ["Modelos Manuais", "Cadeiras Elétricas", "Entrega Grátis", "Manutenção Incluída"],
      products: []
    },
    {
      icon: Wrench,
      title: "Equipamentos Ortopédicos",
      description: "Muletas, andadores, botas ortopédicas e outros equipamentos para reabilitação e mobilidade.",
      features: ["Muletas Ajustáveis", "Botas Ortopédicas", "Andadores", "Produtos Certificados"],
      products: []
    },
    {
      icon: Sun,
      title: "Painéis Solares",
      description: "Venda e instalação de sistemas de energia solar para residências e empresas.",
      features: ["Instalação Completa", "Equipamentos Premium", "Economia Garantida", "Manutenção Preventiva"],
      products: []
    },
    {
      icon: PartyPopper,
      title: "Artigos para Eventos",
      description: "Aluguel de equipamentos para eventos sociais, corporativos e celebrações especiais.",
      features: ["Produtos Disponíveis"],
      products: [
        {
          name: "Champanheira",
          images: ["/lovable-uploads/5bfda0af-8184-45c9-9c9b-f7afe1563bdc.png"],
          description: "Champanheira elegante para manter suas bebidas geladas durante eventos e celebrações."
        },
        {
          name: "Refresqueira-Suqueira",
          images: ["/lovable-uploads/fe140465-5fb5-4eb6-ad77-4d7d9c4d479d.png"],
          description: "Refresqueira para sucos e bebidas com capacidade para 5 litros."
        },
        {
          name: "Máquina de Fumaça",
          images: ["/lovable-uploads/f5913e90-6e6b-4dcb-b519-9105b15b286f.png"],
          description: "Máquina de fumaça profissional para criar efeitos especiais em eventos e festas.",
          subProducts: [
            {
              name: "Líquido Fluido para Máquina de Fumaça",
              images: ["/lovable-uploads/liquido-fog-azul.png", "/lovable-uploads/liquido-fog-rosa.png"],
              description: "Líquido especial para máquinas de fumaça disponível em diferentes cores e aromas."
            }
          ]
        },
        {
          name: "Chopeiras",
          images: ["/lovable-uploads/440c6639-a3c8-43f7-9899-e9d7f61cd83c.png"],
          description: "Chopeira elétrica profissional para eventos, festas e celebrações."
        }
      ]
    },
    {
      icon: Truck,
      title: "Entrega e Retirada",
      description: "Serviço de entrega rápida e retirada de equipamentos médicos na sua residência.",
      features: ["Entrega em 24h", "Região Metropolitana", "Sem Taxa Extra", "Agendamento Flexível"],
      products: []
    },
    {
      icon: Shield,
      title: "Equipamentos Higienizados",
      description: "Todos os equipamentos são higienizados e testados antes da entrega ao cliente.",
      features: ["Higienização Completa", "Testes de Segurança", "Certificação Sanitária", "Qualidade Garantida"],
      products: []
    },
    {
      icon: HeadphonesIcon,
      title: "Suporte Técnico",
      description: "Atendimento especializado para dúvidas, manutenção e suporte técnico dos equipamentos.",
      features: ["WhatsApp - atendimento entre 8:00 e 19:00h", "Técnicos Qualificados", "Troca Imediata", "Orientação de Uso"],
      products: []
    }
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block gradient-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
            🏥 Nossos Serviços
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Soluções Completas em
            <span className="gradient-primary bg-clip-text text-transparent"> Saúde & Energia</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Oferecemos equipamentos médicos de qualidade e soluções sustentáveis em energia solar.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="shadow-elegant hover:shadow-glow transition-smooth border-border bg-card group">
              {/* Seção especial para Painéis Solares com imagens */}
              {service.title === "Painéis Solares" && (
                <div className="relative overflow-hidden rounded-t-lg">
                  <div className="grid grid-cols-2 gap-1 mb-4">
                    <img 
                      src={solarPanels1} 
                      alt="Painéis solares instalados em telhado residencial"
                      className="w-full h-24 object-cover rounded-tl-lg"
                    />
                    <img 
                      src={solarInstallation} 
                      alt="Instalação profissional de painéis solares"
                      className="w-full h-24 object-cover rounded-tr-lg"
                    />
                  </div>
                  <div className="px-6">
                    <img 
                      src={solarPanelsClose} 
                      alt="Detalhes dos painéis fotovoltaicos de alta qualidade"
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                  </div>
                </div>
              )}
              
              <CardHeader>
                <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4 group-hover:shadow-glow transition-smooth">
                  <service.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <div 
                  className={`flex items-center justify-between ${service.products.length > 0 ? 'cursor-pointer' : ''}`}
                  onClick={() => service.products.length > 0 && setExpandedCategory(expandedCategory === service.title ? null : service.title)}
                >
                  <CardTitle className="text-xl font-bold text-card-foreground">{service.title}</CardTitle>
                  {service.products.length > 0 && (
                    <div className="text-primary">
                      {expandedCategory === service.title ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                  )}
                </div>
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                    {service.products.length > 0 && feature === "Produtos Disponíveis" ? (
                      <button
                        onClick={() => setExpandedCategory(expandedCategory === service.title ? null : service.title)}
                        className="text-primary hover:text-primary/80 underline font-medium transition-smooth"
                      >
                        {feature}
                      </button>
                    ) : (
                      feature
                    )}
                  </li>
                ))}
              </ul>
                
                {/* Produtos expandidos */}
                {expandedCategory === service.title && service.products.length > 0 && (
                  <div className="mt-6 space-y-4">
                    <h4 className="font-semibold text-foreground border-t border-border pt-4">Produtos Disponíveis:</h4>
                    {service.products.map((product, productIdx) => (
                      <div key={productIdx} className="border border-border rounded-lg bg-background/50">
                        <div 
                          className="flex items-center gap-4 p-4 cursor-pointer hover:bg-background/70 transition-smooth"
                          onClick={() => setExpandedProduct(expandedProduct === product.name ? null : product.name)}
                        >
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded-lg shadow-sm"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium text-foreground">{product.name}</h5>
                              <div className="text-primary">
                                {expandedProduct === product.name ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                          </div>
                        </div>
                        
                        {/* Galeria de fotos expandida */}
                        {expandedProduct === product.name && (
                          <div className="px-4 pb-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                              {product.images.map((image, imgIdx) => (
                                <img 
                                  key={imgIdx}
                                  src={image} 
                                  alt={`${product.name} - Foto ${imgIdx + 1}`}
                                  className="w-full h-32 object-cover rounded-lg shadow-sm hover:shadow-md transition-smooth cursor-pointer"
                                />
                              ))}
                            </div>
                            
                            {/* Botão adicionar ao carrinho */}
                            <div className="mt-4 flex gap-2">
                              <Button 
                                onClick={() => addToCart({
                                  id: `${service.title}-${product.name}`,
                                  name: product.name,
                                  description: product.description,
                                  image: product.images[0],
                                  category: service.title
                                })}
                                className="flex-1"
                                size="sm"
                              >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Adicionar ao Carrinho
                              </Button>
                            </div>

                            {/* Subprodutos */}
                            {(product as any).subProducts && (product as any).subProducts.length > 0 && (
                              <div className="mt-6 space-y-3">
                                <h6 className="font-medium text-foreground border-t border-border pt-4">Produtos Relacionados:</h6>
                                {(product as any).subProducts.map((subProduct: any, subIdx: number) => (
                                  <div key={subIdx} className="border border-border rounded-lg bg-background/30 p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                      <img 
                                        src={subProduct.images[0]} 
                                        alt={subProduct.name}
                                        className="w-16 h-16 object-cover rounded-lg shadow-sm"
                                      />
                                      <div className="flex-1">
                                        <h6 className="font-medium text-foreground text-sm">{subProduct.name}</h6>
                                        <p className="text-xs text-muted-foreground mt-1">{subProduct.description}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-2 mb-3">
                                      {subProduct.images.map((image: string, imgIdx: number) => (
                                        <img 
                                          key={imgIdx}
                                          src={image} 
                                          alt={`${subProduct.name} - Foto ${imgIdx + 1}`}
                                          className="w-full h-24 object-cover rounded-lg shadow-sm"
                                        />
                                      ))}
                                    </div>
                                    
                                    <Button 
                                      onClick={() => addToCart({
                                        id: `${service.title}-${subProduct.name}`,
                                        name: subProduct.name,
                                        description: subProduct.description,
                                        image: subProduct.images[0],
                                        category: service.title
                                      })}
                                      variant="outline"
                                      size="sm"
                                      className="w-full"
                                    >
                                      <ShoppingCart className="h-4 w-4 mr-2" />
                                      Adicionar ao Carrinho
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;