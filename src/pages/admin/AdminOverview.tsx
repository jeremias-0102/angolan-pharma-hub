
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardCardsRow } from '@/components/admin/DashboardCards';
import SalesTrendsChart from '@/components/admin/SalesTrendsChart';
import StockDistributionChart from '@/components/admin/StockDistributionChart';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ShoppingBag, 
  AlertCircle, 
  Calendar, 
  Package,
  User,
  RefreshCcw,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const TopProductsTable = () => {
  const products = [
    {
      name: 'Paracetamol 500mg',
      category: 'Analgésicos',
      quantity: 86,
      revenue: 'AOA 43,000',
      status: 'Em estoque',
    },
    {
      name: 'Ibuprofeno 600mg',
      category: 'Anti-inflamatórios',
      quantity: 52,
      revenue: 'AOA 31,200',
      status: 'Em estoque',
    },
    {
      name: 'Amoxicilina 500mg',
      category: 'Antibióticos',
      quantity: 34,
      revenue: 'AOA 27,200',
      status: 'Estoque baixo',
    },
    {
      name: 'Dipirona 1g',
      category: 'Analgésicos',
      quantity: 29,
      revenue: 'AOA 17,400',
      status: 'Em estoque',
    },
  ];

  return (
    <Table>
      <TableCaption>Top produtos mais vendidos</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Produto</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Qtd. Vendida</TableHead>
          <TableHead>Receita</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.name}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>{product.quantity}</TableCell>
            <TableCell>{product.revenue}</TableCell>
            <TableCell>
              <Badge variant="outline" className={
                product.status === 'Em estoque' 
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }>
                {product.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const RecentActivities = () => {
  const activities = [
    { 
      id: 1, 
      type: 'order', 
      title: 'Novo pedido recebido', 
      description: 'Pedido #58942 por Maria Silva', 
      time: 'Há 5 minutos',
      icon: <ShoppingBag size={16} className="text-blue-500" />,
    },
    { 
      id: 2, 
      type: 'alert', 
      title: 'Alerta de estoque baixo', 
      description: 'Paracetamol 500mg - Restam 8 unidades', 
      time: 'Há 30 minutos',
      icon: <AlertCircle size={16} className="text-amber-500" />,
    },
    { 
      id: 3, 
      type: 'calendar', 
      title: 'Produtos a vencer', 
      description: '5 produtos vencem nos próximos 30 dias', 
      time: 'Há 2 horas',
      icon: <Calendar size={16} className="text-red-500" />,
    },
    { 
      id: 4, 
      type: 'product', 
      title: 'Produto atualizado', 
      description: 'Vitamina C - Preço alterado para AOA 2,500', 
      time: 'Há 4 horas',
      icon: <Package size={16} className="text-green-500" />,
    },
    { 
      id: 5, 
      type: 'user', 
      title: 'Novo cliente registrado', 
      description: 'João Baptista criou uma conta', 
      time: 'Há 5 horas',
      icon: <User size={16} className="text-purple-500" />,
    },
  ];

  return (
    <Card className="col-span-1">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Atividades Recentes</CardTitle>
          <Button variant="ghost" size="icon">
            <RefreshCcw size={16} />
          </Button>
        </div>
        <CardDescription>Últimas atividades do sistema</CardDescription>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-5">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-3 px-4 py-1">
              <div className="mt-0.5">
                {activity.icon}
              </div>
              <div>
                <p className="font-medium text-sm">{activity.title}</p>
                <p className="text-sm text-gray-500">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="ghost" size="sm" className="w-full text-blue-600">
          Ver todas as atividades
        </Button>
      </CardFooter>
    </Card>
  );
};

const AdminOverview = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Visão Geral</h2>
      <DashboardCardsRow />
      
      <SalesTrendsChart />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Produtos Mais Vendidos</CardTitle>
            <CardDescription>
              Top produtos pelo volume de vendas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TopProductsTable />
          </CardContent>
        </Card>
        
        <RecentActivities />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StockDistributionChart />
        
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Calendário</CardTitle>
            <CardDescription>Eventos importantes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="p-2 border-l-4 border-amber-500">
                <p className="font-medium text-sm">Vencimento de Produtos</p>
                <p className="text-xs text-gray-500">15 de Maio, 2024</p>
              </div>
              <div className="p-2 border-l-4 border-blue-500">
                <p className="font-medium text-sm">Recebimento de Estoque</p>
                <p className="text-xs text-gray-500">18 de Maio, 2024</p>
              </div>
              <div className="p-2 border-l-4 border-green-500">
                <p className="font-medium text-sm">Reunião de Equipe</p>
                <p className="text-xs text-gray-500">20 de Maio, 2024</p>
              </div>
              <div className="p-2 border-l-4 border-red-500">
                <p className="font-medium text-sm">Fechamento Mensal</p>
                <p className="text-xs text-gray-500">31 de Maio, 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
