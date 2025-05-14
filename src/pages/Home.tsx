import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Search, ShoppingCart, Pill, Truck, ChevronRight, ArrowRight } from 'lucide-react';
import { getAll, STORES } from '@/lib/database';
import { Product as ProductType } from '@/types/models';
import ProductCard from '@/components/products/ProductCard';
import HeroCarousel from '@/components/home/HeroCarousel';
import { getCompanySettings } from '@/services/settingsService';

const Home = () => {
  const { user } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companyName, setCompanyName] = useState('BEGJNP Pharma');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getAll<ProductType>(STORES.PRODUCTS);
        // Get most recent products
        const sorted = [...allProducts].sort((a, b) => 
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        setFeaturedProducts(sorted.slice(0, 4));
      } catch (error) {
        console.error('Error fetching products:', error);
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
    
    fetchProducts();
    fetchSettings();
  }, []);

  // Helper for role-based redirects
  const getDashboardLink = () => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'admin': return '/admin';
      case 'pharmacist': return '/pharmacist';
      case 'delivery': return '/delivery';
      default: return '/profile';
    }
  };

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
          </div>
        </div>
      </section>

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
                const productWithPriceSale = {
                  id: product.id,
                  name: product.name,
                  description: product.description,
                  price: product.price,
                  price_sale: product.price, // Add the missing price_sale field
                  image: product.image || '/placeholder.svg',
                  stock: product.batches?.reduce((total, batch) => total + batch.quantity, 0) || 0,
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
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-pharma-light to-white bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Gerencie sua farmácia com eficiência</h2>
            <p className="text-gray-600 mb-8">
              {companyName} oferece todas as ferramentas necessárias para otimizar seu negócio, 
              desde o controle de estoque até entregas e vendas.
            </p>
            <Button 
              size="lg" 
              className="bg-pharma-primary hover:bg-pharma-primary/90"
              asChild
            >
              <Link to="/contato">Entre em contato</Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;
