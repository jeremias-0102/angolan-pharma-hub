
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, ShoppingCart, Pill, Truck, ChevronRight, ArrowRight, Users, Package, TrendingUp, Clock } from 'lucide-react';
import { getAll, STORES } from '@/lib/database';
import { Product as ProductType, Order, User } from '@/types/models';
import ProductCard from '@/components/products/ProductCard';
import HeroCarousel from '@/components/home/HeroCarousel';
import MainLayout from '@/components/layout/MainLayout';
import { getCompanySettings } from '@/services/settingsService';
import { useGlobalToast } from '@/hooks/useGlobalToast';

const Index = () => {
  const { user } = useAuth();
  const { items: cartItems } = useCart();
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companyName, setCompanyName] = useState('BEGJNP Pharma');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    lowStockProducts: 0
  });

  // Use global toast
  useGlobalToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const allProducts = await getAll<ProductType>(STORES.PRODUCTS);
        const sorted = [...allProducts].sort((a, b) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        setFeaturedProducts(sorted.slice(0, 4));

        // Fetch orders
        const allOrders = await getAll<Order>(STORES.ORDERS);
        
        // Fetch users
        const allUsers = await getAll<User>(STORES.USERS);

        // Calculate stats
        const lowStockProducts = allProducts.filter(p => {
          const totalStock = p.batches?.reduce((total, batch) => total + batch.quantity, 0) || p.stock || 0;
          return totalStock <= 10;
        });

        setStats({
          totalProducts: allProducts.length,
          totalOrders: allOrders.length,
          totalUsers: allUsers.length,
          lowStockProducts: lowStockProducts.length
        });

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
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
    
    fetchData();
    fetchSettings();
  }, []);

  // Helper for role-based redirects
  const getDashboardLink = () => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'admin':
      case 'supervisor': 
        return '/admin';
      case 'pharmacist': 
        return '/farmaceutico';
      case 'delivery_person': 
        return '/entregador';
      case 'client':
        return '/perfil';
      default: 
        return '/perfil';
    }
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <MainLayout fullWidth>
      {/* Hero Carousel Section */}
      <section className="relative">
        <HeroCarousel />
        
        <div className="absolute bottom-10 left-0 right-0 z-20 container mx-auto px-4">
          <div className="flex flex-wrap gap-4 max-w-3xl">
            <Button 
              size="lg" 
              className="bg-white text-pharma-primary hover:bg-white/90"
              asChild
            >
              <Link to="/produtos">Ver Produtos</Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white/20"
              asChild
            >
              <Link to={getDashboardLink()}>
                {user ? 'Acessar Painel' : 'Fazer Login'}
              </Link>
            </Button>

            {user && (user.role === 'client' || !user.role) && totalCartItems > 0 && (
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white/20"
                asChild
              >
                <Link to="/carrinho" className="flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Carrinho ({totalCartItems})
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section - Show for logged users */}
      {user && (
        <section className="py-8 bg-gradient-to-r from-pharma-primary/5 to-pharma-accent/5">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardHeader className="pb-3">
                  <div className="h-12 w-12 bg-pharma-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Package className="h-6 w-6 text-pharma-primary" />
                  </div>
                  <CardTitle className="text-2xl">{stats.totalProducts}</CardTitle>
                  <CardDescription>Produtos Cadastrados</CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader className="pb-3">
                  <div className="h-12 w-12 bg-pharma-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <ShoppingCart className="h-6 w-6 text-pharma-primary" />
                  </div>
                  <CardTitle className="text-2xl">{stats.totalOrders}</CardTitle>
                  <CardDescription>Pedidos Realizados</CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader className="pb-3">
                  <div className="h-12 w-12 bg-pharma-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Users className="h-6 w-6 text-pharma-primary" />
                  </div>
                  <CardTitle className="text-2xl">{stats.totalUsers}</CardTitle>
                  <CardDescription>Usuários Registrados</CardDescription>
                </CardHeader>
              </Card>

              <Card className="text-center">
                <CardHeader className="pb-3">
                  <div className="h-12 w-12 bg-red-500/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <TrendingUp className="h-6 w-6 text-red-500" />
                  </div>
                  <CardTitle className="text-2xl">{stats.lowStockProducts}</CardTitle>
                  <CardDescription>Estoque Baixo</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Produtos em Destaque</h2>
            <Link to="/produtos" className="text-pharma-primary flex items-center font-medium hover:underline">
              Ver todos <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-gray-100 rounded-xl p-6 h-80 animate-pulse"></div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => {
                const totalStock = product.batches?.reduce((total, batch) => total + batch.quantity, 0) || product.stock || 0;
                const productWithPriceSale = {
                  id: product.id,
                  name: product.name,
                  description: product.description,
                  price: product.price_cost || 0,
                  price_sale: product.price_sale || 0,
                  image: product.image || '/placeholder.svg',
                  stock: totalStock,
                  needsPrescription: product.requiresPrescription
                };
                return <ProductCard key={product.id} product={productWithPriceSale} />;
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Pill className="h-12 w-12 text-pharma-primary/50 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Nenhum produto encontrado</h3>
              <p className="text-gray-500 mb-6">Adicione produtos para vê-los aqui.</p>
              {user?.role === 'admin' && (
                <Button asChild>
                  <Link to="/admin/products">Adicionar Produtos</Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">{companyName} - Funcionalidades</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="h-12 w-12 bg-pharma-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-pharma-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Catálogo Completo</h3>
              <p className="text-gray-600 mb-4">
                Pesquise e filtre produtos por categoria, disponibilidade e validade.
              </p>
              <Link to="/produtos" className="text-pharma-primary flex items-center font-medium hover:underline">
                Explorar catálogo <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            {/* Feature Card 2 */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="h-12 w-12 bg-pharma-primary/10 rounded-lg flex items-center justify-center mb-4">
                <ShoppingCart className="h-6 w-6 text-pharma-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Compra Simplificada</h3>
              <p className="text-gray-600 mb-4">
                Adicione produtos ao carrinho e finalize com pagamento online seguro.
              </p>
              <Link to="/carrinho" className="text-pharma-primary flex items-center font-medium hover:underline">
                Ver carrinho <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            {/* Feature Card 3 */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="h-12 w-12 bg-pharma-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Truck className="h-6 w-6 text-pharma-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Entrega Rápida</h3>
              <p className="text-gray-600 mb-4">
                Acompanhe seus pedidos em tempo real e receba na sua porta.
              </p>
              <Link to="/sobre" className="text-pharma-primary flex items-center font-medium hover:underline">
                Saiba mais <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            {/* Quick Actions for Logged Users */}
            {user && (
              <>
                {(user.role === 'admin' || user.role === 'supervisor') && (
                  <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                    <div className="h-12 w-12 bg-pharma-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <TrendingUp className="h-6 w-6 text-pharma-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Painel Administrativo</h3>
                    <p className="text-gray-600 mb-4">
                      Gerencie produtos, usuários, pedidos e relatórios da farmácia.
                    </p>
                    <Link to="/admin" className="text-pharma-primary flex items-center font-medium hover:underline">
                      Acessar painel <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                )}

                {user.role === 'pharmacist' && (
                  <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                    <div className="h-12 w-12 bg-pharma-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Pill className="h-6 w-6 text-pharma-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Painel Farmacêutico</h3>
                    <p className="text-gray-600 mb-4">
                      Gerencie prescrições, vendas e controle farmacêutico.
                    </p>
                    <Link to="/farmaceutico" className="text-pharma-primary flex items-center font-medium hover:underline">
                      Acessar painel <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                )}

                {user.role === 'delivery_person' && (
                  <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                    <div className="h-12 w-12 bg-pharma-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <Truck className="h-6 w-6 text-pharma-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Painel Entregador</h3>
                    <p className="text-gray-600 mb-4">
                      Gerencie entregas, rotas e turnos de trabalho.
                    </p>
                    <Link to="/entregador" className="text-pharma-primary flex items-center font-medium hover:underline">
                      Acessar painel <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-pharma-light to-white bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">
              {user ? `Bem-vindo, ${user.name}!` : 'Gerencie sua farmácia com eficiência'}
            </h2>
            <p className="text-gray-600 mb-8">
              {companyName} oferece todas as ferramentas necessárias para otimizar seu negócio, 
              desde o controle de estoque até entregas e vendas.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center">
              {user ? (
                <>
                  <Button 
                    size="lg" 
                    className="bg-pharma-primary hover:bg-pharma-primary/90"
                    asChild
                  >
                    <Link to={getDashboardLink()}>Acessar Painel</Link>
                  </Button>
                  
                  {(user.role === 'client' || !user.role) && (
                    <Button 
                      variant="outline"
                      size="lg"
                      asChild
                    >
                      <Link to="/produtos">Ver Produtos</Link>
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    className="bg-pharma-primary hover:bg-pharma-primary/90"
                    asChild
                  >
                    <Link to="/login">Fazer Login</Link>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    size="lg"
                    asChild
                  >
                    <Link to="/contato">Entre em contato</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
