
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
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
  Settings
} from 'lucide-react';
import UsersManagement from './UsersManagement';
import ProductsManagement from './ProductsManagement';
import OrdersManagement from './OrdersManagement';
import SuppliersManagement from './SuppliersManagement';
import AcquisitionsManagement from './AcquisitionsManagement';
import ReportsPage from './ReportsPage';
import CompanySettings from './CompanySettings';
import AdminOverview from './AdminOverview';

// Admin Dashboard Layout
const AdminDashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="bg-white w-64 h-full shadow-md">
        <div className="p-4 border-b">
          <Link to="/">
            <span className="text-xl font-bold text-pharma-primary">Pharma<span className="text-pharma-secondary">Hub</span></span>
          </Link>
        </div>
        <div className="p-4">
          <p className="text-sm font-medium text-gray-500">Admin</p>
          <p className="text-sm font-bold text-gray-900">{user?.name}</p>
        </div>
        <nav className="mt-2">
          {navItems.map((item, index) => (
            <NavItem key={index} icon={item.icon} path={item.path} name={item.name} />
          ))}
        </nav>
        <div className="absolute bottom-4 w-64 p-4">
          <Button className="w-full" variant="outline" onClick={() => logout()}>
            Sair
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          <h1 className="text-xl font-semibold">Admin Dashboard</h1>
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
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, path, name }) => {
  return (
    <Link 
      to={path} 
      className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 hover:text-pharma-primary"
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
      </Routes>
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;
