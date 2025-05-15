
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';

const Index = () => {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
          Bem-vindo ao <span className="text-blue-600">BEGJNP</span><span className="text-green-600">Pharma</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl">
          Sistema de gestão farmacêutica completo para Angola. Controle seu inventário,
          gerencie vendas e acompanhe seu negócio de forma eficiente.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link to="/produtos">Ver produtos</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/login">Entrar no sistema</Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
