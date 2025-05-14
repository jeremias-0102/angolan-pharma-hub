import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer } from '@/components/ui/chart';
import { 
  ArrowLeft,
  Calculator, 
  BarChart3,
  FileBarChart,
  ReceiptText,
  CalendarIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import ReportDownloadButtons from '@/components/reports/ReportDownloadButtons';

// Example finances data
const financialData = {
  revenue: {
    total: 1250000,
    previousPeriod: 980000,
    target: 1500000
  },
  expenses: {
    total: 450000,
    previousPeriod: 520000,
    target: 400000
  },
  profit: {
    total: 800000,
    previousPeriod: 460000,
    target: 1000000
  },
  topProducts: [
    { name: 'Paracetamol 500mg', revenue: 180000, units: 1200 },
    { name: 'Ibuprofeno 400mg', revenue: 150000, units: 950 },
    { name: 'Losartana 50mg', revenue: 145000, units: 850 },
  ],
  topCategories: [
    { name: 'Analgésicos', revenue: 320000, percentage: 25.6 },
    { name: 'Anti-hipertensivos', revenue: 290000, percentage: 23.2 },
    { name: 'Antibióticos', revenue: 180000, percentage: 14.4 },
  ],
  salesByPaymentMethod: [
    { method: 'Multicaixa Express', amount: 625000, percentage: 50 },
    { method: 'Cartão de Crédito', amount: 375000, percentage: 30 },
    { method: 'Dinheiro', amount: 250000, percentage: 20 },
  ],
  monthlySales: [
    { month: 'Jan', value: 680000 },
    { month: 'Fev', value: 720000 },
    { month: 'Mar', value: 750000 },
    { month: 'Abr', value: 890000 },
    { month: 'Mai', value: 925000 },
    { month: 'Jun', value: 980000 },
    { month: 'Jul', value: 1050000 },
    { month: 'Ago', value: 1120000 },
    { month: 'Set', value: 1250000 },
  ],
  monthlyExpenses: [
    { month: 'Jan', value: 410000 },
    { month: 'Fev', value: 420000 },
    { month: 'Mar', value: 430000 },
    { month: 'Abr', value: 450000 },
    { month: 'Mai', value: 460000 },
    { month: 'Jun', value: 470000 },
    { month: 'Jul', value: 465000 },
    { month: 'Ago', value: 455000 },
    { month: 'Set', value: 450000 },
  ],
  monthlyProfit: [
    { month: 'Jan', value: 270000 },
    { month: 'Fev', value: 300000 },
    { month: 'Mar', value: 320000 },
    { month: 'Abr', value: 440000 },
    { month: 'Mai', value: 465000 },
    { month: 'Jun', value: 510000 },
    { month: 'Jul', value: 585000 },
    { month: 'Ago', value: 665000 },
    { month: 'Set', value: 800000 },
  ]
};

const FinancialReportsPage = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [reportPeriod, setReportPeriod] = useState('monthly');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      maximumFractionDigits: 0
    }).format(value);
  };

  const calculateGrowth = (current: number, previous: number) => {
    if (!previous) return 100;
    const growth = ((current - previous) / previous) * 100;
    return growth;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/admin/relatorios')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Relatório Financeiro</h1>
        </div>
        <div className="flex gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Diário</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="monthly">Mensal</SelectItem>
              <SelectItem value="quarterly">Trimestral</SelectItem>
              <SelectItem value="yearly">Anual</SelectItem>
            </SelectContent>
          </Select>
          <ReportDownloadButtons 
            title="Relatório Financeiro" 
            data={financialData} 
            columns={[
              { header: 'Categoria', accessor: 'name' },
              { header: 'Valor (AOA)', accessor: 'value' }
            ]}
          />
        </div>
      </div>

      <Tabs defaultValue="overview" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="revenue">Receitas</TabsTrigger>
          <TabsTrigger value="expenses">Despesas</TabsTrigger>
          <TabsTrigger value="profit">Lucros</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <FileBarChart className="mr-2 h-5 w-5 text-blue-500" />
                  Receita Total
                </CardTitle>
                <CardDescription>Período atual vs. anterior</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">
                  {formatCurrency(financialData.revenue.total)}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={getGrowthColor(calculateGrowth(financialData.revenue.total, financialData.revenue.previousPeriod))}>
                    {calculateGrowth(financialData.revenue.total, financialData.revenue.previousPeriod).toFixed(1)}%
                  </span>
                  <span className="text-gray-500 text-sm">vs período anterior</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Progresso da meta</span>
                    <span>{Math.round((financialData.revenue.total / financialData.revenue.target) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(financialData.revenue.total / financialData.revenue.target) * 100} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Calculator className="mr-2 h-5 w-5 text-red-500" />
                  Despesas Totais
                </CardTitle>
                <CardDescription>Período atual vs. anterior</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">
                  {formatCurrency(financialData.expenses.total)}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={getGrowthColor(-calculateGrowth(financialData.expenses.total, financialData.expenses.previousPeriod))}>
                    {calculateGrowth(financialData.expenses.total, financialData.expenses.previousPeriod).toFixed(1)}%
                  </span>
                  <span className="text-gray-500 text-sm">vs período anterior</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Progresso da meta</span>
                    <span>{Math.round((financialData.expenses.total / financialData.expenses.target) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(financialData.expenses.total / financialData.expenses.target) * 100} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-green-500" />
                  Lucro Líquido
                </CardTitle>
                <CardDescription>Período atual vs. anterior</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-1">
                  {formatCurrency(financialData.profit.total)}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={getGrowthColor(calculateGrowth(financialData.profit.total, financialData.profit.previousPeriod))}>
                    {calculateGrowth(financialData.profit.total, financialData.profit.previousPeriod).toFixed(1)}%
                  </span>
                  <span className="text-gray-500 text-sm">vs período anterior</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Progresso da meta</span>
                    <span>{Math.round((financialData.profit.total / financialData.profit.target) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(financialData.profit.total / financialData.profit.target) * 100} 
                    className="h-2"
                    style={{ backgroundColor: "#f1f5f9" }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Receitas vs Despesas</CardTitle>
                <CardDescription>Evolução mensal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer>
                    {/* Revenue vs Expenses Chart would be here */}
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-md">
                      <span className="text-gray-500">Gráfico de Receitas vs Despesas</span>
                    </div>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lucro Líquido</CardTitle>
                <CardDescription>Evolução mensal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ChartContainer>
                    {/* Profit Chart would be here */}
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-md">
                      <span className="text-gray-500">Gráfico de Lucro Líquido</span>
                    </div>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Produtos</CardTitle>
                <CardDescription>Por receita</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financialData.topProducts.map((product, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{product.name}</span>
                        <span>{formatCurrency(product.revenue)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{product.units} unidades</span>
                        <span>{((product.revenue / financialData.revenue.total) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress 
                        value={(product.revenue / financialData.revenue.total) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top Categorias</CardTitle>
                <CardDescription>Por receita</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financialData.topCategories.map((category, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{category.name}</span>
                        <span>{formatCurrency(category.revenue)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{category.percentage}% das vendas</span>
                      </div>
                      <Progress 
                        value={category.percentage} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Métodos de Pagamento</CardTitle>
                <CardDescription>Distribuição</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financialData.salesByPaymentMethod.map((method, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{method.method}</span>
                        <span>{formatCurrency(method.amount)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{method.percentage}% do total</span>
                      </div>
                      <Progress 
                        value={method.percentage} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Evolução das Receitas</CardTitle>
                <CardDescription>Análise detalhada das fontes de receita</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 mb-6">
                  <ChartContainer>
                    {/* Revenue Chart would be here */}
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-md">
                      <span className="text-gray-500">Gráfico de Evolução das Receitas</span>
                    </div>
                  </ChartContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Receitas por Categoria</h3>
                    {/* Categories would be here */}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">Receitas por Método de Pagamento</h3>
                    {/* Payment methods would be here */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="expenses">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Evolução das Despesas</CardTitle>
                <CardDescription>Análise detalhada das despesas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 mb-6">
                  <ChartContainer>
                    {/* Expenses Chart would be here */}
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-md">
                      <span className="text-gray-500">Gráfico de Evolução das Despesas</span>
                    </div>
                  </ChartContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Despesas por Categoria</h3>
                    {/* Expense categories would be here */}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">Maiores Despesas</h3>
                    {/* Largest expenses would be here */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profit">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Análise de Lucro</CardTitle>
                <CardDescription>Evolução e métricas de lucro</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 mb-6">
                  <ChartContainer>
                    {/* Profit Chart would be here */}
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 rounded-md">
                      <span className="text-gray-500">Gráfico de Evolução do Lucro</span>
                    </div>
                  </ChartContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Margem de Lucro por Categoria</h3>
                    {/* Profit margin would be here */}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-4">Produtos Mais Lucrativos</h3>
                    {/* Most profitable products would be here */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialReportsPage;
