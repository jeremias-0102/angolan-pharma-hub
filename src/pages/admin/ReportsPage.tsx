
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BarChart3, FileText, TrendingUp, Package, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportToPDF } from '@/utils/reportExport';

const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleBack = () => {
    navigate('/admin');
  };

  const generateSalesReport = async () => {
    const salesData = [
      { data: '01/06/2024', produto: 'Paracetamol 500mg', quantidade: 15, valor: 'AOA 5.250,00' },
      { data: '01/06/2024', produto: 'Amoxicilina 500mg', quantidade: 8, valor: 'AOA 5.200,00' },
      { data: '02/06/2024', produto: 'Ibuprofeno 400mg', quantidade: 12, valor: 'AOA 5.040,00' },
    ];

    const columns = [
      { header: 'Data', accessor: 'data' },
      { header: 'Produto', accessor: 'produto' },
      { header: 'Quantidade', accessor: 'quantidade' },
      { header: 'Valor Total', accessor: 'valor' }
    ];

    exportToPDF('Relatório de Vendas', salesData, columns);
  };

  const generateInventoryReport = async () => {
    const inventoryData = [
      { produto: 'Paracetamol 500mg', estoque: 150, valorUnitario: 'AOA 350,00', valorTotal: 'AOA 52.500,00' },
      { produto: 'Amoxicilina 500mg', estoque: 80, valorUnitario: 'AOA 650,00', valorTotal: 'AOA 52.000,00' },
      { produto: 'Ibuprofeno 400mg', estoque: 120, valorUnitario: 'AOA 420,00', valorTotal: 'AOA 50.400,00' },
    ];

    const columns = [
      { header: 'Produto', accessor: 'produto' },
      { header: 'Estoque', accessor: 'estoque' },
      { header: 'Valor Unitário', accessor: 'valorUnitario' },
      { header: 'Valor Total', accessor: 'valorTotal' }
    ];

    exportToPDF('Relatório de Estoque', inventoryData, columns);
  };

  const generateProductsReport = async () => {
    const productsData = [
      { codigo: 'MED-001', nome: 'Paracetamol 500mg', categoria: 'Analgésicos', fabricante: 'Pharma Inc.' },
      { codigo: 'MED-002', nome: 'Amoxicilina 500mg', categoria: 'Antibióticos', fabricante: 'MedLab Angola' },
      { codigo: 'MED-003', nome: 'Ibuprofeno 400mg', categoria: 'Anti-inflamatórios', fabricante: 'Pharma Angola' },
    ];

    const columns = [
      { header: 'Código', accessor: 'codigo' },
      { header: 'Nome', accessor: 'nome' },
      { header: 'Categoria', accessor: 'categoria' },
      { header: 'Fabricante', accessor: 'fabricante' }
    ];

    exportToPDF('Relatório de Produtos', productsData, columns);
  };

  const generateCustomReport = () => {
    toast({
      title: "Relatório Personalizado",
      description: "Funcionalidade em desenvolvimento. Em breve você poderá criar relatórios personalizados.",
    });
  };

  const reportCards = [
    {
      title: "Relatório de Vendas",
      description: "Visualize dados de vendas por período",
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
      action: generateSalesReport
    },
    {
      title: "Relatório de Estoque",
      description: "Acompanhe o status do inventário",
      icon: <Package className="h-8 w-8 text-green-600" />,
      action: generateInventoryReport
    },
    {
      title: "Relatório de Produtos",
      description: "Análise detalhada dos produtos",
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      action: generateProductsReport
    },
    {
      title: "Relatório Personalizado",
      description: "Crie relatórios customizados",
      icon: <FileText className="h-8 w-8 text-orange-600" />,
      action: generateCustomReport
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
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="flex-1">
                <CardTitle className="text-lg">{report.title}</CardTitle>
                <CardDescription className="mt-1">{report.description}</CardDescription>
              </div>
              <div className="ml-4">{report.icon}</div>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full flex items-center"
                onClick={report.action}
              >
                <Download className="mr-2 h-4 w-4" />
                Gerar PDF
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
