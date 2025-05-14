
import React from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  LucideIcon, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Truck, 
  BarChart2, 
  Box,
  Settings,
  Home
} from 'lucide-react';
import UsersManagement from './UsersManagement';
import ProductsManagement from './ProductsManagement';
import OrdersManagement from './OrdersManagement';
import SuppliersManagement from './SuppliersManagement';
import AcquisitionsManagement from './AcquisitionsManagement';
import ReportsPage from './ReportsPage';
import CompanySettings from './CompanySettings';
import AdminOverview from './AdminOverview';
import { companyInfo } from '@/data/mockData';

// Admin Dashboard Layout
const AdminDashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if not admin
  React.useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (user?.role !== 'admin') {
    return <div>Redirecionando...</div>;
  }

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Produtos', icon: Package, path: '/admin/produtos' },
    { name: 'Pedidos', icon: ShoppingCart, path: '/admin/pedidos' },
    { name: 'Aquisições', icon: Box, path: '/admin/aquisicoes' },
    { name: 'Usuários', icon: Users, path: '/admin/usuarios' },
    { name: 'Fornecedores', icon: Truck, path: '/admin/fornecedores' },
    { name: 'Relatórios', icon: BarChart2, path: '/admin/relatorios' },
    { name: 'Configurações', icon: Settings, path: '/admin/configuracao' },
  ];

  // Get active nav item based on current path
  const getActiveNavItem = () => {
    return navItems.find(item => location.pathname === item.path);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="bg-white w-64 h-full shadow-md fixed left-0 top-0 z-30">
        <div className="p-4 border-b">
          <Link to="/">
            <span className="text-xl font-bold text-blue-600">BEGJNP<span className="text-green-600">Pharma</span></span>
          </Link>
        </div>
        <div className="p-4">
          <p className="text-sm font-medium text-gray-500">Admin</p>
          <p className="text-sm font-bold text-gray-900">{user?.name}</p>
        </div>
        <nav className="mt-2">
          {navItems.map((item) => (
            <NavItem 
              key={item.path} 
              icon={item.icon} 
              path={item.path} 
              name={item.name} 
              isActive={location.pathname === item.path}
            />
          ))}
        </nav>
        <div className="absolute bottom-4 w-64 p-4 space-y-2">
          <Button 
            className="w-full flex items-center justify-center bg-pharma-primary hover:bg-pharma-primary/90" 
            onClick={() => navigate('/')}
          >
            <Home className="mr-2 h-4 w-4" />
            Ir para Loja
          </Button>
          <Button 
            className="w-full" 
            variant="outline" 
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Sair
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center px-6 sticky top-0 z-20">
          <div className="flex-1">
            <h1 className="text-xl font-semibold">
              {getActiveNavItem()?.name || 'Admin Dashboard'}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">{companyInfo.phone}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
            >
              <Home className="mr-1 h-4 w-4" />
              Ver Loja
            </Button>
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: LucideIcon;
  path: string;
  name: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, path, name, isActive }) => {
  return (
    <Link 
      to={path} 
      className={`flex items-center px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 ${
        isActive ? 'bg-blue-50 text-blue-600 font-medium border-r-4 border-blue-600' : ''
      }`}
    >
      <Icon className="h-5 w-5 mr-3" />
      <span>{name}</span>
    </Link>
  );
};

// Main Dashboard Component
const AdminDashboard = () => {
  return (
    <AdminDashboardLayout>
      <Routes>
        <Route path="/" element={<AdminOverview />} />
        <Route path="/produtos" element={<ProductsManagement />} />
        <Route path="/pedidos" element={<OrdersManagement />} />
        <Route path="/aquisicoes" element={<AcquisitionsManagement />} />
        <Route path="/usuarios" element={<UsersManagement />} />
        <Route path="/fornecedores" element={<SuppliersManagement />} />
        <Route path="/relatorios" element={<ReportsPage />} />
        <Route path="/configuracao" element={<CompanySettings />} />
        {/* Redirect other paths to the dashboard */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;
