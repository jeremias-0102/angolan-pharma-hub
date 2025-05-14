import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ProductCard from '@/components/products/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, FilterX } from 'lucide-react';
import { getAllProducts } from '@/services/productService';
import { Product as ProductType } from '@/types/models';

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [activeTab, setActiveTab] = useState('all');
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch products from database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getAllProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Get unique categories
  const categories = Array.from(
    new Set(products.map(product => product.category))
  );
  
  // Filter products based on search query and active tab
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeTab === 'all' || product.category === activeTab;
    
    return matchesSearch && matchesCategory;
  });
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'price_low':
        return a.price_sale - b.price_sale;
      case 'price_high':
        return b.price_sale - a.price_sale;
      case 'name_asc':
        return a.name.localeCompare(b.name);
      case 'name_desc':
        return b.name.localeCompare(a.name);
      default:
        // newest (by creation date)
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });
  
  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setSortOption('newest');
    setActiveTab('all');
  };
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Nossos Produtos</h1>
        
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Buscar produtos..."
                className="pl-10"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger>
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Mais recentes</SelectItem>
                  <SelectItem value="price_low">Menor Preço</SelectItem>
                  <SelectItem value="price_high">Maior Preço</SelectItem>
                  <SelectItem value="name_asc">Nome (A-Z)</SelectItem>
                  <SelectItem value="name_desc">Nome (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" onClick={resetFilters} className="flex items-center">
              <FilterX size={16} className="mr-1" />
              <span>Limpar</span>
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pharma-primary"></div>
          </div>
        ) : (
          <>
            {/* Category Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="bg-muted mb-4 flex flex-wrap">
                <TabsTrigger value="all" className="flex-grow sm:flex-grow-0">
                  Todos
                </TabsTrigger>
                {categories.map(category => (
                  <TabsTrigger key={category} value={category} className="flex-grow sm:flex-grow-0 capitalize">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {/* Products grid */}
              <TabsContent value={activeTab} className="mt-0">
                {sortedProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {sortedProducts.map(product => {
                      const productWithPriceSale = {
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        price_sale: product.price, // Add the missing price_sale field
                        image: product.image,
                        stock: product.stock,
                        needsPrescription: product.needsPrescription
                      };
                      return (
                        <ProductCard key={productWithPriceSale.id} product={productWithPriceSale} />
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-lg text-gray-500">Nenhum produto encontrado. Tente outros termos de busca.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Products;
