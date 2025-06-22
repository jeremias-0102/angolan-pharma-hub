import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, LogOut, Settings, ShoppingBag, Pill, Truck, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearchBar = () => {
    setIsSearchBarVisible(!isSearchBarVisible);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      navigate(`/products?search=${searchTerm}`);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Open menu"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-pharma-primary">
          Pharma<span className="text-pharma-secondary">Hub</span>
        </Link>

        {/* Search Bar (Initially Hidden on Mobile) */}
        <div className={`flex items-center w-full max-w-md ${isSearchBarVisible ? '' : 'hidden md:flex'}`}>
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="search"
                placeholder="Pesquisar produtos..."
                className="pl-10 pr-4"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </form>
        </div>

        {/* Mobile Search Button */}
        <button
          onClick={toggleSearchBar}
          className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Open search"
        >
          <Search className="h-6 w-6" />
        </button>

        {/* Cart and User Info */}
        <div className="flex items-center space-x-4">
          {user?.role !== 'admin' && user?.role !== 'supervisor' && (
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-500 hover:text-gray-700" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-1.5 py-0.5">
                  {cart.length}
                </span>
              )}
            </Link>
          )}

          {/* User Dropdown */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {(user.role === 'admin' || user.role === 'supervisor') && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Painel Administrativo
                    </Link>
                  </DropdownMenuItem>
                )}
                
                {user.role === 'pharmacist' && (
                  <DropdownMenuItem asChild>
                    <Link to="/pharmacist" className="cursor-pointer">
                      <Pill className="mr-2 h-4 w-4" />
                      Painel Farmacêutico
                    </Link>
                  </DropdownMenuItem>
                )}

                {user.role === 'delivery' && (
                  <DropdownMenuItem asChild>
                    <Link to="/delivery" className="cursor-pointer">
                      <Truck className="mr-2 h-4 w-4" />
                      Painel do Entregador
                    </Link>
                  </DropdownMenuItem>
                )}
                
                {user.role === 'client' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/orders" className="cursor-pointer">
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Meus Pedidos
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login">
              <Button variant="outline">Entrar</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} bg-gray-50 py-2 px-4`}>
        <Link to="/" className="block py-2 text-gray-700 hover:text-pharma-primary">
          Home
        </Link>
        <Link to="/products" className="block py-2 text-gray-700 hover:text-pharma-primary">
          Produtos
        </Link>
        <Link to="/about" className="block py-2 text-gray-700 hover:text-pharma-primary">
          Sobre Nós
        </Link>
        <Link to="/contact" className="block py-2 text-gray-700 hover:text-pharma-primary">
          Contato
        </Link>
        {user && (
          <>
            {user.role === 'admin' && (
              <Link to="/admin" className="block py-2 text-gray-700 hover:text-pharma-primary">
                Admin Dashboard
              </Link>
            )}
            {user.role === 'client' && (
              <Link to="/profile" className="block py-2 text-gray-700 hover:text-pharma-primary">
                Meu Perfil
              </Link>
            )}
            <Button variant="ghost" onClick={logout} className="w-full justify-start">
              Sair
            </Button>
          </>
        )}
        {!user && (
          <Link to="/login" className="block py-2 text-gray-700 hover:text-pharma-primary">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
