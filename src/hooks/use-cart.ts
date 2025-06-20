
import { useContext } from 'react';
import { CartContext } from '@/contexts/CartContext';
import { Product, CartProduct } from '@/types/models';

export const useCart = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  // Add addToCart function to the context
  const addToCart = (product: Product, quantity: number = 1) => {
    const cartProduct: CartProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price_cost || 0,
      price_sale: product.price_sale || 0,
      image: product.image,
      stock: product.stock || 0,
      requiresPrescription: product.requiresPrescription,
      needsPrescription: product.requiresPrescription,
      quantity
    };
    
    context.addItem(cartProduct, quantity);
  };
  
  // Add removeFromCart function
  const removeFromCart = (productId: string) => {
    context.removeItem(productId);
  };
  
  // Add calculateTotal function to the cart context
  const calculateTotal = () => {
    return context.items.reduce(
      (total, item) => total + ((item.product.price_sale || item.product.price) * item.quantity), 
      0
    );
  };
  
  return {
    ...context,
    addToCart,
    removeFromCart,
    calculateTotal
  };
};
