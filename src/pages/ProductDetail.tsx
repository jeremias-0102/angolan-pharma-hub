
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingCart, AlertCircle, ArrowLeft, Plus, Minus, Check } from 'lucide-react';
import { getProductById } from '@/services/productService';
import { Product } from '@/types/models';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (id) {
          const productData = await getProductById(id);
          setProduct(productData);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  // Calculate total stock
  const getTotalStock = (product: Product | null) => {
    if (!product || !product.batches || product.batches.length === 0) return 0;
    return product.batches.reduce((total, batch) => total + batch.quantity, 0);
  };
  
  const totalStock = getTotalStock(product);
  
  // Format price to Angolan Kwanza
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= totalStock) {
      setQuantity(value);
    }
  };
  
  const increaseQuantity = () => {
    if (quantity < totalStock) {
      setQuantity(quantity + 1);
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.requiresPrescription) {
      toast({
        title: "Prescrição médica necessária",
        description: "Este produto requer prescrição médica. Por favor, adicione a sua prescrição durante o checkout.",
        variant: "destructive",
      });
    }
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price_sale,
      description: product.description,
      image: product.image,
      stock: totalStock,
      needsPrescription: product.requiresPrescription
    }, quantity);
    
    toast({
      title: "Produto adicionado",
      description: `${quantity} unidade(s) de ${product.name} adicionado ao seu carrinho.`,
    });
  };

  const handleBuyNow = () => {
    if (!product) return;
    
    // First, add the item to cart
    handleAddToCart();
    
    // Then navigate to checkout
    navigate('/checkout');
  };
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pharma-primary"></div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Produto não encontrado</h2>
            <p className="mb-6">O produto que você está procurando não existe ou foi removido.</p>
            <Button asChild>
              <Link to="/produtos">Ver outros produtos</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="ghost" className="pl-0">
            <Link to="/produtos" className="flex items-center text-pharma-primary">
              <ArrowLeft size={16} className="mr-2" />
              Voltar aos produtos
            </Link>
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Image */}
            <div className="flex items-center justify-center p-4">
              <img 
                src={product.image || '/placeholder.svg'} 
                alt={product.name} 
                className="max-w-full max-h-80 object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>
            
            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline" className="capitalize">
                    {product.category}
                  </Badge>
                  {product.requiresPrescription && (
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                      <AlertCircle size={14} className="mr-1" />
                      Requer prescrição
                    </Badge>
                  )}
                </div>
              </div>
              
              <div>
                <span className="text-3xl font-bold text-pharma-primary">
                  {formatPrice(product.price_sale)}
                </span>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Descrição</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Disponibilidade</h3>
                {totalStock > 0 ? (
                  <div className="flex items-center">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs text-green-600 mr-2">
                      <Check size={14} />
                    </span>
                    <span className="text-gray-700">
                      {totalStock > 10 
                        ? 'Em estoque' 
                        : `Apenas ${totalStock} em estoque`}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs text-red-600 mr-2">
                      <AlertCircle size={14} />
                    </span>
                    <span className="text-gray-700">Sem estoque</span>
                  </div>
                )}
              </div>
              
              {totalStock > 0 && (
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-4 mb-4">
                    <div>
                      <label htmlFor="quantity" className="text-sm font-medium text-gray-500 block mb-2">
                        Quantidade
                      </label>
                      <div className="flex items-center">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-10 w-10 rounded-r-none"
                          onClick={decreaseQuantity}
                          disabled={quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input 
                          type="number" 
                          id="quantity" 
                          min="1" 
                          max={totalStock}
                          value={quantity} 
                          onChange={handleQuantityChange}
                          className="h-10 w-16 rounded-none text-center"
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-10 w-10 rounded-l-none"
                          onClick={increaseQuantity}
                          disabled={quantity >= totalStock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      onClick={handleAddToCart}
                      variant="outline"
                      className="flex items-center justify-center text-pharma-primary border-pharma-primary hover:bg-pharma-primary hover:text-white"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Adicionar ao Carrinho
                    </Button>
                    
                    <Button
                      onClick={handleBuyNow}
                      className="flex items-center justify-center bg-black hover:bg-black/90 text-white"
                    >
                      Compre Já!
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Payment methods info */}
          <div className="border-t border-gray-100 p-6">
            <p className="text-center text-sm text-gray-500 mb-2">Faça seu checkout de forma segura</p>
            <div className="flex justify-center space-x-4">
              <img src="/visa.svg" alt="Visa" className="h-6" onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.style.display = 'none';
              }} />
              <img src="/mastercard.svg" alt="Mastercard" className="h-6" onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.style.display = 'none';
              }} />
              <img src="/multicaixa.svg" alt="Multicaixa" className="h-6" onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.style.display = 'none';
              }} />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
