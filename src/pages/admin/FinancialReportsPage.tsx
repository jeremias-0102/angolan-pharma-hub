
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  LineChart,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar,
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import ReportDownloadButtons from '@/components/reports/ReportDownloadButtons';

// Mock data for financial reports
const revenueData = [
  { name: 'Jan', value: 45000 },
  { name: 'Fev', value: 52000 },
  { name: 'Mar', value: 49000 },
  { name: 'Abr', value: 63000 },
  { name: 'Mai', value: 58000 },
  { name: 'Jun', value: 71000 },
  { name: 'Jul', value: 75000 },
  { name: 'Ago', value: 68000 },
  { name: 'Set', value: 72000 },
  { name: 'Out', value: 78000 },
  { name: 'Nov', value: 82000 },
  { name: 'Dez', value: 91000 },
];

const expensesData = [
  { name: 'Jan', value: 28000 },
  { name: 'Fev', value: 32000 },
  { name: 'Mar', value: 30000 },
  { name: 'Abr', value: 35000 },
  { name: 'Mai', value: 33000 },
  { name: 'Jun', value: 38000 },
  { name: 'Jul', value: 40000 },
  { name: 'Ago', value: 36000 },
  { name: 'Set', value: 39000 },
  { name: 'Out', value: 42000 },
  { name: 'Nov', value: 45000 },
  { name: 'Dez', value: 48000 },
];

const profitData = revenueData.map((item, index) => ({
  name: item.name,
  value: item.value - expensesData[index].value
}));

const paymentMethodsData = [
  { name: 'Multicaixa', value: 45 },
  { name: 'Cartão', value: 30 },
  { name: 'Dinheiro', value: 25 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const FinancialReportsPage = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 12, 1),
    to: new Date(),
  });

  const formatDate = (date: Date | undefined) => {
    return date ? format(date, 'dd/MM/yyyy', { locale: ptBR }) : 'Data não selecionada';
  };

  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/admin');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Button variant="ghost" onClick={handleBack} className="mr-2">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Relatórios Financeiros</h1>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">
            <DollarSign className="mr-2 h-4 w-4" />
            Receitas
          </TabsTrigger>
          <TabsTrigger value="profit">
            <TrendingUp className="mr-2 h-4 w-4" />
            Lucros
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="mr-2 h-4 w-4" />
            Métodos de Pagamento
          </TabsTrigger>
        </TabsList>

        {/* Receitas */}
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatório de Receitas</CardTitle>
              <CardDescription>
                Análise detalhada das receitas no período selecionado.
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

              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">
                      {formatCurrency(revenueData.reduce((acc, curr) => acc + curr.value, 0))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +12% em relação ao ano anterior
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm font-medium">Média Mensal</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">
                      {formatCurrency(revenueData.reduce((acc, curr) => acc + curr.value, 0) / revenueData.length)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +8% em relação ao ano anterior
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm font-medium">Melhor Mês</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">
                      {revenueData.reduce((max, curr) => max.value > curr.value ? max : curr, { name: '', value: 0 }).name}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(revenueData.reduce((max, curr) => max.value > curr.value ? max : curr, { name: '', value: 0 }).value)}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <ReportDownloadButtons 
                title="Relatório de Receitas" 
                data={revenueData.map(item => ({ 
                  Mês: item.name, 
                  Receita: item.value 
                }))} 
                columns={[
                  { header: 'Mês', accessor: 'Mês' },
                  { header: 'Receita (AOA)', accessor: 'Receita' }
                ]} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lucros */}
        <TabsContent value="profit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatório de Lucros</CardTitle>
              <CardDescription>
                Análise detalhada dos lucros no período selecionado.
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

              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={profitData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm font-medium">Lucro Total</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">
                      {formatCurrency(profitData.reduce((acc, curr) => acc + curr.value, 0))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +15% em relação ao ano anterior
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm font-medium">Margem de Lucro</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">
                      {(profitData.reduce((acc, curr) => acc + curr.value, 0) / revenueData.reduce((acc, curr) => acc + curr.value, 0) * 100).toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +3% em relação ao ano anterior
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="p-4">
                    <CardTitle className="text-sm font-medium">Média Mensal</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold">
                      {formatCurrency(profitData.reduce((acc, curr) => acc + curr.value, 0) / profitData.length)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +10% em relação ao ano anterior
                    </p>
                  </CardContent>
                </Card>
              </div>

              <ReportDownloadButtons 
                title="Relatório de Lucros" 
                data={profitData.map((item, index) => ({ 
                  Mês: item.name, 
                  Receita: revenueData[index].value,
                  Despesas: expensesData[index].value,
                  Lucro: item.value
                }))} 
                columns={[
                  { header: 'Mês', accessor: 'Mês' },
                  { header: 'Receita (AOA)', accessor: 'Receita' },
                  { header: 'Despesas (AOA)', accessor: 'Despesas' },
                  { header: 'Lucro (AOA)', accessor: 'Lucro' }
                ]} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Métodos de Pagamento */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatório de Métodos de Pagamento</CardTitle>
              <CardDescription>
                Análise dos métodos de pagamento utilizados pelos clientes.
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

              <div className="h-[300px] mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentMethodsData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentMethodsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {paymentMethodsData.map((method, index) => (
                  <Card key={method.name}>
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm font-medium">{method.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="text-2xl font-bold">
                        {method.value}%
                      </div>
                      <div className="h-2.5 w-full bg-gray-200 rounded-full mt-2">
                        <div
                          className="h-2.5 rounded-full"
                          style={{ 
                            width: `${method.value}%`, 
                            backgroundColor: COLORS[index % COLORS.length] 
                          }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <ReportDownloadButtons 
                title="Relatório de Métodos de Pagamento" 
                data={paymentMethodsData.map(item => ({ 
                  Método: item.name, 
                  Percentagem: item.value 
                }))} 
                columns={[
                  { header: 'Método de Pagamento', accessor: 'Método' },
                  { header: 'Percentagem (%)', accessor: 'Percentagem' }
                ]} 
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialReportsPage;
