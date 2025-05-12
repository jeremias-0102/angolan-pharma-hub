import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  PieChart, 
  BarChart3, 
  LineChart,
  ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { SalesReportChart } from '@/components/reports/SalesReportChart';
import { InventoryReportChart } from '@/components/reports/InventoryReportChart';
import { PurchasesReportChart } from '@/components/reports/PurchasesReportChart';
import { ReportDownloadButtons } from '@/components/reports/ReportDownloadButtons';

const ReportsPage = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
    to: new Date(),
  });
  const [reportType, setReportType] = useState('sales');

  const formatDate = (date: Date | undefined) => {
    return date ? format(date, 'dd/MM/yyyy', { locale: ptBR }) : 'Data não selecionada';
  };

  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/admin');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Button variant="ghost" onClick={handleBack} className="mr-2">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Relatórios e Análises</h1>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">
            <PieChart className="mr-2 h-4 w-4" />
            Relatório de Vendas
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <BarChart3 className="mr-2 h-4 w-4" />
            Relatório de Estoque
          </TabsTrigger>
          <TabsTrigger value="purchases">
            <LineChart className="mr-2 h-4 w-4" />
            Relatório de Aquisições
          </TabsTrigger>
        </TabsList>
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatório de Vendas</CardTitle>
              <CardDescription>
                Análise detalhada das vendas realizadas no período selecionado.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center space-x-4">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Período:</span>
                <DateRangePicker date={date} onDateChange={setDate} />
                <span>
                  {formatDate(date?.from)} - {formatDate(date?.to)}
                </span>
              </div>
              <SalesReportChart date={date} />
              <ReportDownloadButtons reportType="sales" date={date} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatório de Estoque</CardTitle>
              <CardDescription>
                Visão geral do estado atual do estoque, incluindo produtos em falta e
                níveis de estoque.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center space-x-4">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Período:</span>
                <DateRangePicker date={date} onDateChange={setDate} />
                <span>
                  {formatDate(date?.from)} - {formatDate(date?.to)}
                </span>
              </div>
              <InventoryReportChart date={date} />
              <ReportDownloadButtons reportType="inventory" date={date} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="purchases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatório de Aquisições</CardTitle>
              <CardDescription>
                Acompanhamento das aquisições de produtos, incluindo fornecedores e
                custos.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center space-x-4">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Período:</span>
                <DateRangePicker date={date} onDateChange={setDate} />
                <span>
                  {formatDate(date?.from)} - {formatDate(date?.to)}
                </span>
              </div>
              <PurchasesReportChart date={date} />
              <ReportDownloadButtons reportType="purchases" date={date} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
