
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';
import { Pill, Search, Truck, Shield } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { mockProducts } from '@/data/mockData';

const Home = () => {
  // Featured products (first 4 from our mock data)
  const featuredProducts = mockProducts.slice(0, 4);
  
  // Categories with icons
  const categories = [
    { name: 'Medicamentos', icon: <Pill className="h-10 w-10" />, link: '/produtos/medicamentos' },
    { name: 'Vitaminas e Suplementos', icon: <Pill className="h-10 w-10" />, link: '/produtos/vitaminas' },
    { name: 'Higiene Pessoal', icon: <Pill className="h-10 w-10" />, link: '/produtos/higieneepessoal' },
    { name: 'Beleza', icon: <Pill className="h-10 w-10" />, link: '/produtos/beleza' },
  ];
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pharma-primary to-blue-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Sua Farmácia Online em Angola
            </h1>
            <p className="text-lg mb-8">
              Medicamentos, produtos de saúde e beleza com entrega rápida para todo o país.
              Faça seu pedido agora mesmo!
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Button asChild size="lg" className="bg-white text-pharma-primary hover:bg-gray-100">
                <Link to="/produtos">Ver Produtos</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/contato">Fale Conosco</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Search Section */}
      <section className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Busque por medicamentos, vitaminas e mais..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pharma-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">Categorias Principais</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.link}
                className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow flex flex-col items-center"
              >
                <div className="text-pharma-primary mb-4">{category.icon}</div>
                <h3 className="font-medium">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Produtos em Destaque</h2>
            <Button asChild variant="outline">
              <Link to="/produtos">Ver Todos</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Por Que Escolher a PharmaHub?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-pharma-light p-4 rounded-full mb-4">
                <Truck className="h-8 w-8 text-pharma-secondary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Entrega Rápida</h3>
              <p className="text-gray-600">
                Entregamos em todo o território angolano com rapidez e segurança.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-pharma-light p-4 rounded-full mb-4">
                <Pill className="h-8 w-8 text-pharma-secondary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Produtos de Qualidade</h3>
              <p className="text-gray-600">
                Trabalhamos apenas com medicamentos e produtos certificados.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="bg-pharma-light p-4 rounded-full mb-4">
                <Shield className="h-8 w-8 text-pharma-secondary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Compra Segura</h3>
              <p className="text-gray-600">
                Sua compra é protegida e seus dados estão seguros conosco.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-pharma-primary py-12 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Pronto para fazer seu pedido?</h2>
          <p className="max-w-2xl mx-auto mb-6">
            Junte-se a milhares de clientes satisfeitos e experimente o melhor serviço de farmácia online de Angola.
          </p>
          <Button asChild size="lg" className="bg-white text-pharma-primary hover:bg-gray-100">
            <Link to="/produtos">Comprar Agora</Link>
          </Button>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
