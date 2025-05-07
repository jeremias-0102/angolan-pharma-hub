
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LucideIcon, LayoutDashboard, Package, ShoppingCart, List, Bell } from 'lucide-react';

// Pharmacist Dashboard Layout
const PharmacistDashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if not pharmacist
  React.useEffect(() => {
    if (user?.role !== 'pharmacist') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (user?.role !== 'pharmacist') {
    return <div>Redirecionando...</div>;
  }

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/pharmacist' },
    { name: 'Pedidos', icon: ShoppingCart, path: '/pharmacist/pedidos' },
    { name: 'Produtos', icon: Package, path: '/pharmacist/produtos' },
    { name: 'Estoque', icon: List, path: '/pharmacist/estoque' },
    { name: 'Notificações', icon: Bell, path: '/pharmacist/notificacoes' },
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
          <p className="text-sm font-medium text-gray-500">Farmacêutico</p>
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
          <h1 className="text-xl font-semibold">Farmacêutico Dashboard</h1>
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

// Pharmacist Dashboard Pages
const PharmacistOverview = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Visão Geral</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard title="Novos Pedidos" value="8" description="Aguardando processamento" />
        <DashboardCard title="Pedidos em Processamento" value="12" description="Em andamento" />
        <DashboardCard title="Produtos com Estoque Baixo" value="5" description="Necessitam reposição" />
      </div>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-3xl font-bold text-pharma-primary mt-2">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
};

// Main Dashboard Component
const PharmacistDashboard = () => {
  return (
    <PharmacistDashboardLayout>
      <Routes>
        <Route path="/" element={<PharmacistOverview />} />
        <Route path="/pedidos" element={<div>Lista de Pedidos</div>} />
        <Route path="/produtos" element={<div>Gerenciar Produtos</div>} />
        <Route path="/estoque" element={<div>Controle de Estoque</div>} />
        <Route path="/notificacoes" element={<div>Notificações</div>} />
      </Routes>
    </PharmacistDashboardLayout>
  );
};

export default PharmacistDashboard;
