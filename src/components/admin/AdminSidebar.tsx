
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Truck,
  LineChart,
  Settings,
  Layers,
  ClipboardList,
  PieChart,
  FileText,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SidebarItem = ({ 
  path, 
  icon: Icon, 
  label, 
  currentPath 
}: { 
  path: string; 
  icon: React.ElementType; 
  label: string; 
  currentPath: string 
}) => {
  const isActive = currentPath === path;
  
  return (
    <Link
      to={path}
      className={cn(
        "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition",
        isActive
          ? "bg-pharma-primary/10 text-pharma-primary"
          : "text-gray-600 hover:text-pharma-primary hover:bg-pharma-primary/5"
      )}
    >
      <Icon className="h-5 w-5 mr-3" />
      <span>{label}</span>
    </Link>
  );
};

const AdminSidebar = () => {
  const location = useLocation();
  
  const sidebarItems = [
    {
      path: '/admin',
      icon: LayoutDashboard,
      label: 'Visão Geral'
    },
    {
      path: '/admin/dashboard',
      icon: PieChart,
      label: 'Dashboard'
    },
    {
      path: '/admin/produtos',
      icon: Package,
      label: 'Produtos'
    },
    {
      path: '/admin/pedidos',
      icon: ShoppingCart,
      label: 'Pedidos'
    },
    {
      path: '/admin/usuarios',
      icon: Users,
      label: 'Usuários'
    },
    {
      path: '/admin/fornecedores',
      icon: Truck,
      label: 'Fornecedores'
    },
    {
      path: '/admin/aquisicoes',
      icon: ClipboardList,
      label: 'Aquisições'
    },
    {
      path: '/admin/lotes',
      icon: Layers,
      label: 'Lotes'
    },
    {
      path: '/admin/relatorios',
      icon: LineChart,
      label: 'Relatórios'
    },
    {
      path: '/admin/relatorios-financeiros',
      icon: FileText,
      label: 'Financeiro'
    },
    {
      path: '/admin/configuracoes',
      icon: Settings,
      label: 'Configurações'
    }
  ];
  
  return (
    <div className="w-64 bg-white h-screen p-5 border-r shadow-sm">
      <div className="flex flex-col h-full">
        <div className="mb-6 mt-2">
          <h1 className="text-xl font-bold text-pharma-primary">BEGJNP Pharma</h1>
          <p className="text-sm text-gray-500">Painel Administrativo</p>
        </div>
        
        <div className="space-y-1 flex-1">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.path}
              path={item.path}
              icon={item.icon}
              label={item.label}
              currentPath={location.pathname}
            />
          ))}
        </div>
        
        <div className="pt-6 border-t">
          <Link
            to="/"
            className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-600 hover:text-pharma-primary hover:bg-pharma-primary/5 transition"
          >
            <Home className="h-5 w-5 mr-3" />
            <span>Página Inicial</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
