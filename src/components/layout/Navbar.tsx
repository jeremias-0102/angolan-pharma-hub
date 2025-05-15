
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, Menu, X, Home, Search as SearchIcon, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import NotificationBar from './NotificationBar';
import { useIsMobile } from '@/hooks/use-mobile';
import { getCompanySettings } from '@/services/settingsService';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [companyName, setCompanyName] = useState('BEGJNP Pharma');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getCompanySettings();
        if (settings?.name) {
          setCompanyName(settings.name);
        }
      } catch (error) {
        console.error('Error fetching company settings:', error);
      }
    };
    
    fetchSettings();
  }, []);

  const getDashboardLink = () => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'admin': return '/admin';
      case 'pharmacist': return '/pharmacist';
      case 'delivery': return '/delivery';
      case 'client': return '/profile';
      default: return '/';
    }
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Produtos', path: '/produtos' },
    { name: 'Sobre', path: '/sobre' },
    { name: 'Contato', path: '/contato' },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 md:px-6 py-2 container mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-bold text-blue-600">BEGJNP<span className="text-green-600">Pharma</span></h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/" className="text-gray-700 hover:text-pharma-primary px-3 py-2 rounded-md text-sm font-medium">Home</Link>
          <Link to="/produtos" className="text-gray-700 hover:text-pharma-primary px-3 py-2 rounded-md text-sm font-medium">Produtos</Link>
          <Link to="/sobre" className="text-gray-700 hover:text-pharma-primary px-3 py-2 rounded-md text-sm font-medium">Sobre</Link>
          <Link to="/contato" className="text-gray-700 hover:text-pharma-primary px-3 py-2 rounded-md text-sm font-medium">Contato</Link>
        </div>

        {/* Actions Area */}
        <div className="flex items-center space-x-3">
          {/* Notificações - Apenas para usuários autenticados */}
          {isAuthenticated && <NotificationBar />}
          
          {/* Cart */}
          <Link to="/carrinho">
            <Button variant="ghost" className="relative p-2">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-pharma-secondary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          {/* User menu */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-2">
                  <User size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user?.name}</span>
                    <span className="text-xs text-gray-500">{user?.email}</span>
                    <span className="text-xs font-medium text-pharma-primary capitalize mt-1">
                      {user?.role}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={getDashboardLink()} className="w-full cursor-pointer">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="w-full cursor-pointer">
                    Meu Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/pedidos" className="w-full cursor-pointer">
                    Meus Pedidos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default" size="sm" className="bg-pharma-primary hover:bg-pharma-primary/90">
              <Link to="/login">Entrar</Link>
            </Button>
          )}

          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden p-2" 
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.path}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  location.pathname === item.path 
                    ? "bg-pharma-light text-pharma-primary" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-pharma-primary"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
