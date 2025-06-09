
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BarChart3, FileText, TrendingUp, Package } from "lucide-react";

const ReportsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/admin');
  };

  const reportCards = [
    {
      title: "Relatório de Vendas",
      description: "Visualize dados de vendas por período",
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
      action: () => console.log("Gerar relatório de vendas")
    },
    {
      title: "Relatório de Estoque",
      description: "Acompanhe o status do inventário",
      icon: <Package className="h-8 w-8 text-green-600" />,
      action: () => console.log("Gerar relatório de estoque")
    },
    {
      title: "Relatório de Produtos",
      description: "Análise detalhada dos produtos",
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      action: () => console.log("Gerar relatório de produtos")
    },
    {
      title: "Relatório Personalizado",
      description: "Crie relatórios customizados",
      icon: <FileText className="h-8 w-8 text-orange-600" />,
      action: () => console.log("Criar relatório personalizado")
    }
  ];

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={handleBack} className="mr-2">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Relatórios</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {reportCards.map((report, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={report.action}>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="flex-1">
                <CardTitle className="text-lg">{report.title}</CardTitle>
                <CardDescription className="mt-1">{report.description}</CardDescription>
              </div>
              <div className="ml-4">{report.icon}</div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                Gerar Relatório
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Resumo Rápido</CardTitle>
            <CardDescription>Estatísticas principais do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">156</div>
                <div className="text-sm text-gray-500">Vendas Este Mês</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">1,234</div>
                <div className="text-sm text-gray-500">Produtos em Estoque</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">45</div>
                <div className="text-sm text-gray-500">Pedidos Pendentes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">12</div>
                <div className="text-sm text-gray-500">Produtos em Falta</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
