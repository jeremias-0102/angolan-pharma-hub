
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useToast } from '@/components/ui/use-toast';

const Cart = () => {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Format price to Angolan Kwanza
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Por favor, faça login para continuar com a compra.",
        variant: "default",
      });
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-2xl font-bold mb-4">Carrinho de Compras</h1>
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 rounded-full bg-gray-100">
                <ShoppingCartIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold">Seu carrinho está vazio</h2>
              <p className="text-gray-500">Adicione produtos ao seu carrinho para continuar.</p>
              <Button asChild className="mt-4 bg-pharma-primary">
                <Link to="/produtos">Ver Produtos</Link>
              </Button>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Carrinho de Compras</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produto
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preço
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantidade
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {items.map((item) => (
                      <tr key={item.product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-16 w-16 flex-shrink-0 mr-4">
                              <img 
                                src={item.product.image} 
                                alt={item.product.name}
                                className="h-full w-full object-cover rounded-md" 
                              />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{item.product.name}</div>
                              <div className="text-sm text-gray-500">
                                {item.product.needsPrescription && "Requer prescrição"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {formatPrice(item.product.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8 rounded-full"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input 
                              type="number" 
                              min="1"
                              max={item.product.stock}
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                              className="h-8 w-16 text-center mx-2"
                            />
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8 rounded-full"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center font-medium">
                          {formatPrice(item.product.price * item.quantity)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeItem(item.product.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <Button variant="outline" asChild>
                <Link to="/produtos">Continuar Comprando</Link>
              </Button>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({totalItems} itens)</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Entrega</span>
                  <span>Calculado no checkout</span>
                </div>
                <div className="pt-2 mt-2 border-t border-dashed border-gray-200">
                  <div className="flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Taxas de entrega calculadas no checkout
                  </p>
                </div>
              </div>
              
              <Button 
                className="w-full mt-6 bg-pharma-primary hover:bg-pharma-primary/90 flex items-center justify-center"
                onClick={handleCheckout}
              >
                <span>Finalizar Compra</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <div className="mt-4">
                <div className="text-xs text-gray-500 space-y-2">
                  <p>Métodos de pagamento aceitos:</p>
                  <div className="flex space-x-2">
                    <div className="bg-gray-100 rounded px-2 py-1 text-xs">Cartão de Crédito</div>
                    <div className="bg-gray-100 rounded px-2 py-1 text-xs">Pagamento na Entrega</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

// Shopping Cart Icon Component
const ShoppingCartIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    className={className}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={1.5} 
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
    />
  </svg>
);

export default Cart;
