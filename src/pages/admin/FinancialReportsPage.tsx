
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, DollarSign, TrendingUp, PieChart, Calendar } from "lucide-react";

const FinancialReportsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/admin');
  };

  const financialCards = [
    {
      title: "Balanço Patrimonial",
      description: "Visualize ativos, passivos e patrimônio",
      icon: <PieChart className="h-8 w-8 text-blue-600" />,
      action: () => console.log("Gerar balanço patrimonial")
    },
    {
      title: "DRE (Demonstração de Resultados)",
      description: "Receitas, custos e lucros do período",
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      action: () => console.log("Gerar DRE")
    },
    {
      title: "Fluxo de Caixa",
      description: "Controle de entradas e saídas",
      icon: <DollarSign className="h-8 w-8 text-purple-600" />,
      action: () => console.log("Gerar fluxo de caixa")
    },
    {
      title: "Relatório Mensal",
      description: "Resumo financeiro mensal",
      icon: <Calendar className="h-8 w-8 text-orange-600" />,
      action: () => console.log("Gerar relatório mensal")
    }
  ];

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={handleBack} className="mr-2">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Relatórios Financeiros</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        {financialCards.map((report, index) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumo Financeiro</CardTitle>
            <CardDescription>Dados do mês atual</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Receita Total</span>
                <span className="text-lg font-bold text-green-600">{formatCurrency(2450000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Custos Totais</span>
                <span className="text-lg font-bold text-red-600">{formatCurrency(1680000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Lucro Líquido</span>
                <span className="text-lg font-bold text-blue-600">{formatCurrency(770000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Margem de Lucro</span>
                <span className="text-lg font-bold">31.4%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Indicadores de Performance</CardTitle>
            <CardDescription>KPIs financeiros principais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm font-medium">ROI (Retorno sobre Investimento)</span>
                <span className="text-lg font-bold text-green-600">24.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Ticket Médio</span>
                <span className="text-lg font-bold">{formatCurrency(15600)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Vendas por Dia</span>
                <span className="text-lg font-bold">{formatCurrency(81667)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Crescimento Mensal</span>
                <span className="text-lg font-bold text-green-600">+12.3%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialReportsPage;
