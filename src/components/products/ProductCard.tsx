import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    price_sale: number;
    image?: string;
    stock: number;
    needsPrescription: boolean;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem: addToCart } = useCart();
  const { toast } = useToast();
  
  // Format price to Angolan Kwanza
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    const productToAdd = {
      ...product,
      quantity: 1,
    };
    addToCart(productToAdd);
    toast({
      title: "Produto adicionado",
      description: `${product.name} foi adicionado ao seu carrinho.`,
    });
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <Link to={`/produtos/${product.id}`}>
        <div className="h-48 overflow-hidden">
          <img 
            src={product.image || "/placeholder.svg"} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/placeholder.svg';
            }}
          />
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/produtos/${product.id}`}>
          <h3 className="font-medium mb-1 text-pharma-dark hover:text-pharma-primary transition-colors line-clamp-2 h-12">
            {product.name}
          </h3>
        </Link>
        <div className="flex justify-between items-center mb-3">
          <span className="text-lg font-bold text-pharma-primary">
            {formatPrice(product.price)}
          </span>
          {product.stock <= 5 && product.stock > 0 ? (
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              Estoque baixo
            </span>
          ) : product.stock === 0 ? (
            <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
              Sem estoque
            </span>
          ) : null}
        </div>
        <div className="flex items-center justify-between">
          {product.needsPrescription && (
            <div className="flex items-center text-xs text-amber-600 mr-2">
              <AlertCircle size={14} className="mr-1" />
              <span>Precisa receita</span>
            </div>
          )}
          <div className="flex-grow"></div>
          <Button
            onClick={handleAddToCart}
            variant="outline"
            size="sm"
            className="text-pharma-primary border-pharma-primary hover:bg-pharma-primary hover:text-white"
            disabled={product.stock === 0}
          >
            <ShoppingCart size={16} className="mr-1" />
            <span>Adicionar</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
