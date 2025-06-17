
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
  Home,
  Building2,
  Clock
} from 'lucide-react';
import UsersManagement from './UsersManagement';
import ProductsManagement from './ProductsManagement';
import OrdersManagement from './OrdersManagement';
import SuppliersManagement from './SuppliersManagement';
import AcquisitionsManagement from './AcquisitionsManagement';
import ReportsPage from './ReportsPage';
import CompanySettings from './CompanySettings';
import AdminOverview from './AdminOverview';
import CategoriesManagement from './CategoriesManagement';
import BatchesManagement from './BatchesManagement';
import FinancialReportsPage from './FinancialReportsPage';
import { companyInfo } from '@/data/mockData';

// Admin Dashboard Layout
const AdminDashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, canAccessAdminPanel, canDeleteRecords } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if not admin or supervisor
  React.useEffect(() => {
    if (!canAccessAdminPanel()) {
      navigate('/login');
    }
  }, [user, navigate, canAccessAdminPanel]);

  if (!canAccessAdminPanel()) {
    return <div>Redirecionando...</div>;
  }

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Produtos', icon: Package, path: '/admin/produtos' },
    { name: 'Categorias', icon: Package, path: '/admin/categorias' },
    { name: 'Lotes', icon: Box, path: '/admin/lotes' },
    { name: 'Pedidos', icon: ShoppingCart, path: '/admin/pedidos' },
    { name: 'Aquisições', icon: Box, path: '/admin/aquisicoes' },
    { name: 'Fornecedores', icon: Building2, path: '/admin/fornecedores' },
    { name: 'Relatórios', icon: BarChart2, path: '/admin/relatorios' },
    { name: 'Relatórios Financeiros', icon: BarChart2, path: '/admin/relatorios-financeiros' },
    { name: 'Fecho de Turno', icon: Clock, path: '/admin/fecho-turno' },
    { name: 'Configurações', icon: Settings, path: '/admin/configuracoes' },
  ];

  // Adicionar gestão de usuários APENAS para supervisor
  if (user?.role === 'supervisor') {
    navItems.splice(-2, 0, { name: 'Usuários', icon: Users, path: '/admin/usuarios' });
  }

  // Get active nav item based on current path
  const getActiveNavItem = () => {
    return navItems.find(item => location.pathname === item.path);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="bg-white w-64 h-full shadow-md fixed left-0 top-0 z-30">
        <div className="p-4 border-b">
          <span className="text-xl font-bold text-blue-600">BEGJNP<span className="text-green-600">Pharma</span></span>
        </div>
        <div className="p-4">
          <p className="text-sm font-medium text-gray-500">
            {user?.role === 'supervisor' ? 'Supervisor' : 'Administrador'}
          </p>
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
            <span className="text-sm text-pharma-primary font-medium">
              {user?.role === 'supervisor' ? 'Supervisor' : 'Administrador'}: {user?.name}
            </span>
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

// Componente para Fecho de Turno
const FechoTurno: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Fecho de Turno</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600">Funcionalidade de fecho de turno em desenvolvimento...</p>
      </div>
    </div>
  );
};

// Main Dashboard Component
const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <AdminDashboardLayout>
      <Routes>
        <Route path="/" element={<AdminOverview />} />
        <Route path="/produtos" element={<ProductsManagement />} />
        <Route path="/categorias" element={<CategoriesManagement />} />
        <Route path="/lotes" element={<BatchesManagement />} />
        <Route path="/pedidos" element={<OrdersManagement />} />
        <Route path="/aquisicoes" element={<AcquisitionsManagement />} />
        <Route path="/fornecedores" element={<SuppliersManagement />} />
        <Route path="/relatorios" element={<ReportsPage />} />
        <Route path="/relatorios-financeiros" element={<FinancialReportsPage />} />
        <Route path="/fecho-turno" element={<FechoTurno />} />
        <Route path="/configuracoes" element={<CompanySettings />} />
        {/* Rota de usuários APENAS para supervisor */}
        {user?.role === 'supervisor' && (
          <Route path="/usuarios" element={<UsersManagement />} />
        )}
        {/* Redirect other paths to the dashboard */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;
