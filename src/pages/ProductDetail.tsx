
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { mockProducts } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingCart, AlertCircle, ArrowLeft, Plus, Minus, Check } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();
  
  // Find the product by id
  const product = mockProducts.find(p => p.id === parseInt(id || '0'));
  
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
    if (!isNaN(value) && value >= 1 && value <= product.stock) {
      setQuantity(value);
    }
  };
  
  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const handleAddToCart = () => {
    if (product.needsPrescription) {
      toast({
        title: "Prescrição médica necessária",
        description: "Este produto requer prescrição médica. Por favor, adicione a sua prescrição durante o checkout.",
        variant: "destructive",
      });
    }
    
    addItem(product, quantity);
    toast({
      title: "Produto adicionado",
      description: `${quantity} unidade(s) de ${product.name} adicionado ao seu carrinho.`,
    });
  };
  
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
                src={product.image} 
                alt={product.name} 
                className="max-w-full max-h-80 object-contain"
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
                  {product.needsPrescription && (
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                      <AlertCircle size={14} className="mr-1" />
                      Requer prescrição
                    </Badge>
                  )}
                </div>
              </div>
              
              <div>
                <span className="text-3xl font-bold text-pharma-primary">
                  {formatPrice(product.price)}
                </span>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Descrição</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Disponibilidade</h3>
                {product.stock > 0 ? (
                  <div className="flex items-center">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs text-green-600 mr-2">
                      <Check size={14} />
                    </span>
                    <span className="text-gray-700">
                      {product.stock > 10 
                        ? 'Em estoque' 
                        : `Apenas ${product.stock} em estoque`}
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
              
              {product.stock > 0 && (
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
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
                          max={product.stock} 
                          value={quantity} 
                          onChange={handleQuantityChange}
                          className="h-10 w-16 rounded-none text-center"
                        />
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-10 w-10 rounded-l-none"
                          onClick={increaseQuantity}
                          disabled={quantity >= product.stock}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      onClick={handleAddToCart}
                      className="flex-grow bg-pharma-primary hover:bg-pharma-primary/90"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Adicionar ao Carrinho
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
