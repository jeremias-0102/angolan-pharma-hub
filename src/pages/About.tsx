
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Award, Clock, Truck, Check, Shield, Star } from 'lucide-react';

const About = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-pharma-primary to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Sobre a PharmaHub</h1>
            <p className="text-lg opacity-90 mb-8">
              Conheça nossa história e nosso compromisso com a saúde em Angola.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Nossa História</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Começamos com uma missão simples: tornar os medicamentos e produtos 
                de saúde acessíveis para todos os angolanos.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <img 
                  src="/placeholder.svg" 
                  alt="Equipe PharmaHub" 
                  className="rounded-lg shadow-md w-full h-auto"
                />
              </div>
              <div className="flex flex-col justify-center">
                <p className="mb-4 text-gray-700">
                  Fundada em 2020, a PharmaHub nasceu da necessidade de facilitar o acesso 
                  a medicamentos em Angola. Nossa jornada começou com uma pequena equipe 
                  apaixonada por saúde e tecnologia, decidida a transformar a maneira como 
                  as pessoas adquirem produtos farmacêuticos.
                </p>
                <p className="text-gray-700">
                  Ao longo dos anos, expandimos nossa operação para atender todo o país, 
                  mantendo sempre o compromisso com a qualidade dos produtos e o 
                  atendimento excepcional ao cliente. Hoje, somos uma referência 
                  no mercado farmacêutico online de Angola.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="inline-block p-3 bg-blue-100 rounded-lg mb-4">
                  <Star className="h-8 w-8 text-pharma-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Nossa Missão</h3>
                <p className="text-gray-600">
                  Proporcionar acesso fácil e seguro a medicamentos e produtos de saúde 
                  para todos os angolanos, contribuindo para o bem-estar da população 
                  através de soluções tecnológicas inovadoras.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="inline-block p-3 bg-green-100 rounded-lg mb-4">
                  <Award className="h-8 w-8 text-pharma-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Nossa Visão</h3>
                <p className="text-gray-600">
                  Ser a principal referência em farmácia online em Angola, reconhecida 
                  pela excelência no atendimento, qualidade dos produtos e comprometimento 
                  com a saúde e bem-estar dos nossos clientes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Nossos Valores</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Os princípios que guiam nossas operações e relacionamentos.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="inline-block p-3 bg-blue-100 rounded-lg mb-4">
                  <Shield className="h-6 w-6 text-pharma-primary" />
                </div>
                <h3 className="font-bold mb-2">Confiança</h3>
                <p className="text-gray-600 text-sm">
                  Trabalhamos apenas com fornecedores certificados e produtos 
                  de qualidade comprovada.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="inline-block p-3 bg-green-100 rounded-lg mb-4">
                  <Clock className="h-6 w-6 text-pharma-secondary" />
                </div>
                <h3 className="font-bold mb-2">Agilidade</h3>
                <p className="text-gray-600 text-sm">
                  Processos otimizados para garantir rapidez na entrega e no atendimento.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="inline-block p-3 bg-purple-100 rounded-lg mb-4">
                  <Truck className="h-6 w-6 text-pharma-accent" />
                </div>
                <h3 className="font-bold mb-2">Acessibilidade</h3>
                <p className="text-gray-600 text-sm">
                  Comprometidos em levar saúde para todas as regiões de Angola.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="inline-block p-3 bg-amber-100 rounded-lg mb-4">
                  <Check className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="font-bold mb-2">Qualidade</h3>
                <p className="text-gray-600 text-sm">
                  Rigoroso controle de qualidade em todos os produtos que comercializamos.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="inline-block p-3 bg-red-100 rounded-lg mb-4">
                  <Award className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-bold mb-2">Excelência</h3>
                <p className="text-gray-600 text-sm">
                  Buscamos a excelência em todos os aspectos do nosso negócio.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="inline-block p-3 bg-teal-100 rounded-lg mb-4">
                  <Star className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="font-bold mb-2">Inovação</h3>
                <p className="text-gray-600 text-sm">
                  Sempre em busca de novas tecnologias para melhorar a experiência do cliente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-pharma-primary py-12 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Junte-se a nós nessa jornada</h2>
          <p className="max-w-2xl mx-auto mb-6">
            Experimente a maneira mais fácil de cuidar da sua saúde. 
            Produtos de qualidade, entregas rápidas e atendimento especializado.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Button asChild variant="default" size="lg" className="bg-white text-pharma-primary hover:bg-gray-100">
              <Link to="/produtos">Explorar Produtos</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
              <Link to="/contato">Fale Conosco</Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;
