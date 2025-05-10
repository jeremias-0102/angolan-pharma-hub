
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, TrendingUp, ShoppingBag, ShoppingCart, Package, Users } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
  trend?: 'up' | 'down' | 'neutral';
  percentage?: string;
  icon: 'sales' | 'orders' | 'products' | 'customers';
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  description, 
  trend = 'neutral',
  percentage,
  icon
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'sales':
        return <TrendingUp className="h-4 w-4 text-muted-foreground" />;
      case 'orders':
        return <ShoppingBag className="h-4 w-4 text-muted-foreground" />;
      case 'products':
        return <Package className="h-4 w-4 text-muted-foreground" />;
      case 'customers':
        return <Users className="h-4 w-4 text-muted-foreground" />;
      default:
        return <TrendingUp className="h-4 w-4 text-muted-foreground" />;
    }
  };
  
  const getTrendIcon = () => {
    if (!percentage) return null;
    
    return trend === 'up' 
      ? <ArrowUpRight className="h-4 w-4 text-green-500" /> 
      : trend === 'down' 
        ? <ArrowDownRight className="h-4 w-4 text-red-500" /> 
        : null;
  };
  
  const getTrendClass = () => {
    if (!percentage) return '';
    
    return trend === 'up' 
      ? 'text-green-500' 
      : trend === 'down' 
        ? 'text-red-500' 
        : 'text-gray-500';
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {getIcon()}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground mt-1 flex items-center">
          {description}
          {percentage && (
            <span className={`flex items-center ml-2 ${getTrendClass()}`}>
              {getTrendIcon()}
              <span className="ml-1">{percentage}</span>
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const DashboardCardsRow: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DashboardCard
        title="Total de Vendas"
        value="AOA 285.000"
        description="Últimos 30 dias"
        trend="up"
        percentage="12%"
        icon="sales"
      />
      <DashboardCard
        title="Pedidos Ativos"
        value="24"
        description="Aguardando processamento"
        trend="up"
        percentage="8%"
        icon="orders"
      />
      <DashboardCard
        title="Produtos"
        value="65"
        description="Em estoque"
        trend="down"
        percentage="5%"
        icon="products"
      />
      <DashboardCard
        title="Clientes"
        value="142"
        description="Registrados no sistema"
        trend="up"
        percentage="18%"
        icon="customers"
      />
    </div>
  );
};
