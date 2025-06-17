
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BarChart3, FileText, TrendingUp, Package, Download } from "lucide-react";
import { generateSalesReport, generateInventoryReport, generateShiftsReport, exportReportToPDF, exportReportToExcel } from '@/services/reportsService';
import { toast } from '@/hooks/use-toast';
import ReportDownloadButtons from '@/components/reports/ReportDownloadButtons';

const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleBack = () => {
    navigate('/admin');
  };

  const handleGenerateReport = async (reportType: 'sales' | 'inventory' | 'shifts', format: 'pdf' | 'excel') => {
    setIsGenerating(true);
    try {
      let success = false;
      
      if (format === 'pdf') {
        success = await exportReportToPDF(reportType);
      } else {
        success = await exportReportToExcel(reportType);
      }
      
      if (success) {
        toast({
          title: "Relatório gerado!",
          description: `O relatório foi exportado em formato ${format.toUpperCase()} com sucesso.`,
        });
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast({
        title: "Erro ao gerar relatório",
        description: "Ocorreu um erro ao gerar o relatório. Tenta novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const reportCards = [
    {
      title: "Relatório de Vendas",
      description: "Visualize dados de vendas por período",
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
      type: 'sales' as const,
      actions: (
        <div className="flex space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleGenerateReport('sales', 'pdf')}
            disabled={isGenerating}
            className="flex items-center text-blue-600"
          >
            <FileText className="mr-1 h-4 w-4" />
            PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleGenerateReport('sales', 'excel')}
            disabled={isGenerating}
            className="flex items-center text-green-600"
          >
            <Download className="mr-1 h-4 w-4" />
            Excel
          </Button>
        </div>
      )
    },
    {
      title: "Relatório de Estoque",
      description: "Acompanhe o status do inventário",
      icon: <Package className="h-8 w-8 text-green-600" />,
      type: 'inventory' as const,
      actions: (
        <div className="flex space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleGenerateReport('inventory', 'pdf')}
            disabled={isGenerating}
            className="flex items-center text-blue-600"
          >
            <FileText className="mr-1 h-4 w-4" />
            PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleGenerateReport('inventory', 'excel')}
            disabled={isGenerating}
            className="flex items-center text-green-600"
          >
            <Download className="mr-1 h-4 w-4" />
            Excel
          </Button>
        </div>
      )
    },
    {
      title: "Relatório de Turnos",
      description: "Análise de turnos e produtividade",
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      type: 'shifts' as const,
      actions: (
        <div className="flex space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleGenerateReport('shifts', 'pdf')}
            disabled={isGenerating}
            className="flex items-center text-blue-600"
          >
            <FileText className="mr-1 h-4 w-4" />
            PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleGenerateReport('shifts', 'excel')}
            disabled={isGenerating}
            className="flex items-center text-green-600"
          >
            <Download className="mr-1 h-4 w-4" />
            Excel
          </Button>
        </div>
      )
    },
    {
      title: "Relatório Personalizado",
      description: "Crie relatórios customizados",
      icon: <FileText className="h-8 w-8 text-orange-600" />,
      type: 'custom' as const,
      actions: (
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={true}
            className="w-full"
          >
            Em breve
          </Button>
        </div>
      )
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
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="flex-1">
                <CardTitle className="text-lg">{report.title}</CardTitle>
                <CardDescription className="mt-1">{report.description}</CardDescription>
              </div>
              <div className="ml-4">{report.icon}</div>
            </CardHeader>
            <CardContent>
              {report.actions}
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

      {isGenerating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin h-6 w-6 border-2 border-pharma-primary border-t-transparent rounded-full"></div>
              <span>Gerando relatório...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
