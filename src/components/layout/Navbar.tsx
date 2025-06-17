
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, User, LogOut, Menu, X, Package, Home, Phone, Info, Bell } from 'lucide-react';
import { companyInfo } from '@/data/mockData';
import { useNotifications } from '@/contexts/NotificationsContext';

const Navbar: React.FC = () => {
  const { user, logout, canAccessAdminPanel } = useAuth();
  const { items: cartItems } = useCart();
  const { notifications, unreadCount } = useNotifications();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLogoClick = () => {
    if (user && canAccessAdminPanel()) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const handleCartClick = () => {
    // Verificar se o usuário tem permissão para acessar o carrinho
    if (user && (user.role === 'admin' || user.role === 'supervisor')) {
      // Redirecionar administradores para o painel admin
      navigate('/admin');
      return;
    }
    navigate('/carrinho');
  };

  const handleProductsClick = () => {
    // Verificar se o usuário tem permissão para ver produtos
    if (user && (user.role === 'admin' || user.role === 'supervisor')) {
      // Redirecionar administradores para o painel admin
      navigate('/admin');
      return;
    }
    navigate('/produtos');
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Verificar se é uma página administrativa
  const isAdminPage = location.pathname.startsWith('/admin') || 
                     location.pathname.startsWith('/farmaceutico') || 
                     location.pathname.startsWith('/entregador');

  // Se o usuário é admin/supervisor e está tentando acessar páginas públicas, redirecionar
  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'supervisor') && 
        !isAdminPage && location.pathname !== '/login') {
      navigate('/admin');
    }
  }, [user, location.pathname, navigate, isAdminPage]);

  // Verificar se deve mostrar o carrinho (apenas para clientes e usuários não logados)
  const shouldShowCart = !user || user.role === 'client';

  // Verificar se deve mostrar produtos (apenas para clientes e usuários não logados)
  const shouldShowProducts = !user || user.role === 'client';

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button 
              onClick={handleLogoClick}
              className="flex items-center space-x-2 text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors"
            >
              <span>BEGJNP<span className="text-green-600">Pharma</span></span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {!isAdminPage && (
                <>
                  <Link 
                    to="/" 
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium flex items-center transition-colors"
                  >
                    <Home className="mr-1 h-4 w-4" />
                    Início
                  </Link>
                  {shouldShowProducts && (
                    <button 
                      onClick={handleProductsClick}
                      className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium flex items-center transition-colors"
                    >
                      <Package className="mr-1 h-4 w-4" />
                      Produtos
                    </button>
                  )}
                  <Link 
                    to="/sobre" 
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium flex items-center transition-colors"
                  >
                    <Info className="mr-1 h-4 w-4" />
                    Sobre
                  </Link>
                  <Link 
                    to="/contato" 
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium flex items-center transition-colors"
                  >
                    <Phone className="mr-1 h-4 w-4" />
                    Contato
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right side - Cart, Notifications, User */}
          <div className="flex items-center space-x-4">
            {/* Cart - apenas para clientes */}
            {shouldShowCart && !isAdminPage && (
              <button 
                onClick={handleCartClick}
                className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                    {totalItems}
                  </Badge>
                )}
              </button>
            )}

            {/* Notifications */}
            {user && (
              <div className="relative">
                <button className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors">
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                      {unreadCount}
                    </Badge>
                  )}
                </button>
              </div>
            )}

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700 hidden sm:block">
                  Olá, {user.name}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sair</span>
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button size="sm" className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>Entrar</span>
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-700 hover:text-blue-600"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
              {!isAdminPage && (
                <>
                  <Link 
                    to="/" 
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium flex items-center"
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Início
                  </Link>
                  {shouldShowProducts && (
                    <button 
                      onClick={handleProductsClick}
                      className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium flex items-center w-full text-left"
                    >
                      <Package className="mr-2 h-4 w-4" />
                      Produtos
                    </button>
                  )}
                  <Link 
                    to="/sobre" 
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium flex items-center"
                  >
                    <Info className="mr-2 h-4 w-4" />
                    Sobre
                  </Link>
                  <Link 
                    to="/contato" 
                    className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium flex items-center"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Contato
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
