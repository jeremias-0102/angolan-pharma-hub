
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Package2, // Replacing BoxSeam with Package2
  ShoppingCart, 
  Users, 
  Settings, 
  BarChart4, 
  DollarSign,
  Truck,
  Layers,
  Menu,
  Tag
} from 'lucide-react';

const navItems = [
  { title: 'Dashboard', icon: <Home size={20} />, path: '/admin' },
  { title: 'Produtos', icon: <Package size={20} />, path: '/admin/products' },
  { title: 'Categorias', icon: <Tag size={20} />, path: '/admin/categories' },
  { title: 'Lotes', icon: <Package2 size={20} />, path: '/admin/batches' }, // Updated icon
  { title: 'Pedidos', icon: <ShoppingCart size={20} />, path: '/admin/orders' },
  { title: 'Fornecedores', icon: <Truck size={20} />, path: '/admin/suppliers' },
  { title: 'Aquisições', icon: <Layers size={20} />, path: '/admin/acquisitions' },
  { title: 'Usuários', icon: <Users size={20} />, path: '/admin/users' },
  { title: 'Relatórios', icon: <BarChart4 size={20} />, path: '/admin/reports' },
  { title: 'Finanças', icon: <DollarSign size={20} />, path: '/admin/financial' },
  { title: 'Configurações', icon: <Settings size={20} />, path: '/admin/settings' },
];

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`bg-gray-900 text-white h-screen ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 ease-in-out`}>
      <div className="flex justify-between items-center p-4 border-b border-gray-800">
        {!isCollapsed && <h1 className="text-xl font-bold">Admin</h1>}
        <button onClick={toggleSidebar} className={`p-1 rounded-md hover:bg-gray-800 ${isCollapsed ? 'mx-auto' : ''}`}>
          <Menu size={24} />
        </button>
      </div>
      <nav className="mt-5">
        <ul>
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center p-3 ${isCollapsed ? 'justify-center' : 'px-5'} hover:bg-gray-800 transition-colors duration-200 ${
                  location.pathname === item.path ? 'bg-gray-800' : ''
                }`}
              >
                <span className={`mr-3 ${isCollapsed ? 'mr-0' : ''}`}>{item.icon}</span>
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
