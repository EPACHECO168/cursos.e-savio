import { Button } from "@/components/ui/button";
import { Menu, X, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import logoESavio from "@/assets/logo-esavio-new.png";
import { CartTrigger } from "@/components/Cart";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-background/80 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img 
              src={logoESavio} 
              alt="e-savio - Equipamentos Médicos e Painéis Solares" 
              className="w-14 h-14 object-contain"
            />
            <span className="text-3xl font-bold text-foreground">e-savio</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-foreground hover:text-primary transition-smooth">
              Início
            </a>
            <a href="/#services" className="text-foreground hover:text-primary transition-smooth">
              Serviços
            </a>
            <a href="#about" className="text-foreground hover:text-primary transition-smooth">
              Sobre
            </a>
            <a href="#contact" className="text-foreground hover:text-primary transition-smooth">
              Contato
            </a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://wa.me/5514997519972"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-smooth"
              aria-label="Contato via WhatsApp"
            >
              <MessageCircle size={36} className="text-green-600 hover:text-green-700" />
            </a>
            <CartTrigger />
            <a
              href="https://wa.me/5514997519972"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="hero" className="shadow-elegant">
                Solicitar Orçamento
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <a
              href="https://wa.me/5514997519972"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary transition-smooth"
              aria-label="Contato via WhatsApp"
            >
              <MessageCircle size={36} className="text-green-600 hover:text-green-700" />
            </a>
            <CartTrigger />
            <button
              className="text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={36} /> : <Menu size={36} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              <a
                href="#home"
                className="text-foreground hover:text-primary transition-smooth"
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </a>
              <a
                href="/#services"
                className="text-foreground hover:text-primary transition-smooth"
                onClick={() => setIsMenuOpen(false)}
              >
                Serviços
              </a>
              <a
                href="#about"
                className="text-foreground hover:text-primary transition-smooth"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre
              </a>
              <a
                href="#contact"
                className="text-foreground hover:text-primary transition-smooth"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </a>
              <a
                href="https://wa.me/5514997519972"
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button variant="hero" className="mt-4 shadow-elegant w-full">
                  Solicitar Orçamento
                </Button>
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;