
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LucideIcon, LayoutDashboard, Truck, MapPin, Bell, History } from 'lucide-react';

// Delivery Dashboard Layout
const DeliveryDashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Redirect if not delivery
  React.useEffect(() => {
    if (user?.role !== 'delivery') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (user?.role !== 'delivery') {
    return <div>Redirecionando...</div>;
  }

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/delivery' },
    { name: 'Entregas Pendentes', icon: Truck, path: '/delivery/pendentes' },
    { name: 'Mapa de Entregas', icon: MapPin, path: '/delivery/mapa' },
    { name: 'Histórico', icon: History, path: '/delivery/historico' },
    { name: 'Notificações', icon: Bell, path: '/delivery/notificacoes' },
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
          <p className="text-sm font-medium text-gray-500">Entregador</p>
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
          <h1 className="text-xl font-semibold">Entregador Dashboard</h1>
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

// Delivery Dashboard Pages
const DeliveryOverview = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Visão Geral</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard title="Entregas Para Hoje" value="5" description="Pendentes" />
        <DashboardCard title="Entregas em Andamento" value="2" description="Em rota" />
        <DashboardCard title="Entregas Concluídas" value="45" description="Este mês" />
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
const DeliveryDashboard = () => {
  return (
    <DeliveryDashboardLayout>
      <Routes>
        <Route path="/" element={<DeliveryOverview />} />
        <Route path="/pendentes" element={<div>Entregas Pendentes</div>} />
        <Route path="/mapa" element={<div>Mapa de Entregas</div>} />
        <Route path="/historico" element={<div>Histórico de Entregas</div>} />
        <Route path="/notificacoes" element={<div>Notificações</div>} />
      </Routes>
    </DeliveryDashboardLayout>
  );
};

export default DeliveryDashboard;
