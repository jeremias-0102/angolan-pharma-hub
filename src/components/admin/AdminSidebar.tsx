
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Truck,
  FileText,
  Settings,
  Building,
  BarChart3,
  Tags
} from 'lucide-react';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard
  },
  {
    title: 'Produtos',
    href: '/admin/products',
    icon: Package
  },
  {
    title: 'Categorias',
    href: '/admin/categories',
    icon: Tags
  },
  {
    title: 'Lotes',
    href: '/admin/batches',
    icon: Package
  },
  {
    title: 'Usuários',
    href: '/admin/users',
    icon: Users
  },
  {
    title: 'Pedidos',
    href: '/admin/orders',
    icon: ShoppingCart
  },
  {
    title: 'Fornecedores',
    href: '/admin/suppliers',
    icon: Building
  },
  {
    title: 'Aquisições',
    href: '/admin/acquisitions',
    icon: Truck
  },
  {
    title: 'Relatórios',
    href: '/admin/reports',
    icon: BarChart3
  },
  {
    title: 'Configurações',
    href: '/admin/settings',
    icon: Settings
  }
];

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-pharma-primary">Admin Panel</h2>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-pharma-primary text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
