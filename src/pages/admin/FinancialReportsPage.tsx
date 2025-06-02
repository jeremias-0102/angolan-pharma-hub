import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp, Users } from 'lucide-react';
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartConfig {
  type: 'bar' | 'line' | 'pie';
  data: any;
  options: any;
}

interface ChartProps {
  config: ChartConfig;
}

const Chart: React.FC<ChartProps> = ({ config }) => {
  return <Bar options={config.options} data={config.data} />;
};

const data = [
  {
    name: "Pedro Henrique",
    email: "pedro.henrique@mail.com",
    date: "2023/01/05",
    status: "active"
  },
  {
    name: "Maria Rita",
    email: "maria.rita@mail.com",
    date: "2023/03/12",
    status: "inactive"
  },
  {
    name: "Ana Clara",
    email: "ana.clara@mail.com",
    date: "2023/04/01",
    status: "active"
  },
  {
    name: "José Antonio",
    email: "jose.antonio@mail.com",
    date: "2023/06/08",
    status: "active"
  },
  {
    name: "Fernanda Silva",
    email: "fernanda.silva@mail.com",
    date: "2023/08/14",
    status: "inactive"
  },
]

const FinancialReportsPage = () => {
  const financialData: any = {
    revenue: { 
      total: 2500000, 
      previousPeriod: 2250000, 
      target: 2800000 
    },
    expenses: { 
      total: 1200000, 
      previousPeriod: 1100000, 
      target: 1300000 
    },
    profit: { 
      total: 1300000, 
      previousPeriod: 1150000, 
      target: 1500000 
    },
    newCustomers: { 
      total: 150, 
      previousPeriod: 130, 
      target: 180 
    },
    ordersCompleted: { 
      total: 850, 
      previousPeriod: 780, 
      target: 900 
    },
    customerSatisfaction: { 
      total: 4.5, 
      previousPeriod: 4.2, 
      target: 4.7 
    },
    monthlyRevenue: [
      { month: 'Janeiro', value: 200000 },
      { month: 'Fevereiro', value: 220000 },
      { month: 'Março', value: 250000 },
      { month: 'Abril', value: 230000 },
      { month: 'Maio', value: 260000 },
      { month: 'Junho', value: 280000 },
    ],
    monthlyExpenses: [
      { month: 'Janeiro', value: 90000 },
      { month: 'Fevereiro', value: 100000 },
      { month: 'Março', value: 110000 },
      { month: 'Abril', value: 105000 },
      { month: 'Maio', value: 115000 },
      { month: 'Junho', value: 120000 },
    ],
    monthlyProfit: [
      { month: 'Janeiro', value: 110000 },
      { month: 'Fevereiro', value: 120000 },
      { month: 'Março', value: 140000 },
      { month: 'Abril', value: 125000 },
      { month: 'Maio', value: 145000 },
      { month: 'Junho', value: 160000 },
    ]
  };

  const monthlyRevenueData = {
    labels: financialData.monthlyRevenue.map((item: any) => item.month),
    datasets: [
      {
        label: 'Receita Mensal',
        data: financialData.monthlyRevenue.map((item: any) => item.value),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  const monthlyExpensesData = {
    labels: financialData.monthlyExpenses.map((item: any) => item.month),
    datasets: [
      {
        label: 'Despesas Mensais',
        data: financialData.monthlyExpenses.map((item: any) => item.value),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const monthlyProfitData = {
    labels: financialData.monthlyProfit.map((item: any) => item.month),
    datasets: [
      {
        label: 'Lucro Mensal',
        data: financialData.monthlyProfit.map((item: any) => item.value),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Relatórios Financeiros</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Receita Total</CardTitle>
            <CardDescription>Visão geral da receita total.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialData.revenue.total} AOA</div>
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <ArrowUp className="h-4 w-4 mr-2" />
              <span>{(((financialData.revenue.total - financialData.revenue.previousPeriod) / financialData.revenue.previousPeriod) * 100).toFixed(2)}% vs. Período Anterior</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <Users className="h-4 w-4 mr-2" />
              <span>Meta: {financialData.revenue.target} AOA</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Despesas Totais</CardTitle>
            <CardDescription>Visão geral das despesas totais.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialData.expenses.total} AOA</div>
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <ArrowDown className="h-4 w-4 mr-2" />
              <span>{(((financialData.expenses.total - financialData.expenses.previousPeriod) / financialData.expenses.previousPeriod) * 100).toFixed(2)}% vs. Período Anterior</span>
            </div>
             <div className="flex items-center text-sm text-muted-foreground mt-2">
              <Users className="h-4 w-4 mr-2" />
              <span>Meta: {financialData.expenses.target} AOA</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lucro Total</CardTitle>
            <CardDescription>Visão geral do lucro total.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialData.profit.total} AOA</div>
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <ArrowUp className="h-4 w-4 mr-2" />
              <span>{(((financialData.profit.total - financialData.profit.previousPeriod) / financialData.profit.previousPeriod) * 100).toFixed(2)}% vs. Período Anterior</span>
            </div>
             <div className="flex items-center text-sm text-muted-foreground mt-2">
              <Users className="h-4 w-4 mr-2" />
              <span>Meta: {financialData.profit.target} AOA</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Receita Mensal</CardTitle>
            <CardDescription>Visão geral da receita mensal.</CardDescription>
          </CardHeader>
          <CardContent>
            <Chart config={{
              type: 'bar',
              data: monthlyRevenueData,
              options: {
                responsive: true,
                plugins: {
                  legend: { position: 'top' as const },
                  title: { display: false }
                }
              }
            }}/>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Despesas Mensais</CardTitle>
            <CardDescription>Visão geral das despesas mensais.</CardDescription>
          </CardHeader>
          <CardContent>
            <Chart config={{
              type: 'bar',
              data: monthlyExpensesData,
              options: {
                responsive: true,
                plugins: {
                  legend: { position: 'top' as const },
                  title: { display: false }
                }
              }
            }}/>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lucro Mensal</CardTitle>
            <CardDescription>Visão geral do lucro mensal.</CardDescription>
          </CardHeader>
          <CardContent>
            <Chart config={{
              type: 'bar',
              data: monthlyProfitData,
              options: {
                responsive: true,
                plugins: {
                  legend: { position: 'top' as const },
                  title: { display: false }
                }
              }
            }}/>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      <Card>
        <CardHeader>
          <CardTitle>Novos Clientes</CardTitle>
          <CardDescription>Lista de novos clientes.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{financialData.newCustomers.total}</div>
          <div className="flex items-center text-sm text-muted-foreground mt-2">
            <ArrowUp className="h-4 w-4 mr-2" />
            <span>{(((financialData.newCustomers.total - financialData.newCustomers.previousPeriod) / financialData.newCustomers.previousPeriod) * 100).toFixed(2)}% vs. Período Anterior</span>
          </div>
           <div className="flex items-center text-sm text-muted-foreground mt-2">
            <Users className="h-4 w-4 mr-2" />
            <span>Meta: {financialData.newCustomers.target}</span>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
          <CardDescription>Informações sobre os clientes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Lista de clientes.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.email}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.date}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={item.status == "active" ? "default" : "secondary"}>
                      {item.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReportsPage;
