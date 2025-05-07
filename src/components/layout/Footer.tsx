
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Logo and about */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-xl font-bold text-pharma-primary">Pharma<span className="text-pharma-secondary">Hub</span></span>
            </div>
            <p className="text-gray-600 text-sm">
              Sua farmácia online de confiança em Angola. Oferecemos medicamentos de qualidade e entrega rápida para todo o país.
            </p>
            <div className="flex space-x-4 text-gray-500">
              <a href="#" className="hover:text-pharma-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-pharma-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-pharma-primary transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
              Links Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-pharma-primary text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/produtos" className="text-gray-600 hover:text-pharma-primary text-sm">
                  Produtos
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-gray-600 hover:text-pharma-primary text-sm">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-gray-600 hover:text-pharma-primary text-sm">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
              Categorias
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/produtos/medicamentos" className="text-gray-600 hover:text-pharma-primary text-sm">
                  Medicamentos
                </Link>
              </li>
              <li>
                <Link to="/produtos/vitaminas" className="text-gray-600 hover:text-pharma-primary text-sm">
                  Vitaminas e Suplementos
                </Link>
              </li>
              <li>
                <Link to="/produtos/higieneepessoal" className="text-gray-600 hover:text-pharma-primary text-sm">
                  Higiene Pessoal
                </Link>
              </li>
              <li>
                <Link to="/produtos/beleza" className="text-gray-600 hover:text-pharma-primary text-sm">
                  Beleza
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact information */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-4">
              Contato
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin size={16} className="mr-2 text-pharma-primary mt-0.5" />
                <span className="text-gray-600 text-sm">
                  Avenida 4 de Fevereiro, 123<br />
                  Luanda, Angola
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2 text-pharma-primary" />
                <span className="text-gray-600 text-sm">+244 923 456 789</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2 text-pharma-primary" />
                <span className="text-gray-600 text-sm">contato@pharmahub.co.ao</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} PharmaHub. Todos os direitos reservados.
          </p>
          <div className="mt-4 sm:mt-0 text-sm text-gray-500 space-x-4">
            <Link to="/termos" className="hover:text-pharma-primary">
              Termos de Uso
            </Link>
            <Link to="/privacidade" className="hover:text-pharma-primary">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
