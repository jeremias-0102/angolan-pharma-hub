import { Order, OrderStatus, Delivery } from '@/types/models';
import { add, update, get, remove, getAll, STORES } from '@/lib/database';
import { generateUUID } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

// Get all orders
export const getAllOrders = async (): Promise<Order[]> => {
  return await getAll<Order>(STORES.ORDERS);
};

// Get order by ID
export const getOrderById = async (id: string): Promise<Order | null> => {
  return await get<Order>(STORES.ORDERS, id);
};

// Add a new order
export const addOrder = async (order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order> => {
  const newOrder: Order = {
    ...order,
    id: uuidv4(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  await add<Order>(STORES.ORDERS, newOrder);
  return newOrder;
};

// Update an order
export const updateOrder = async (order: Order): Promise<Order> => {
  const updatedOrder = {
    ...order,
    updated_at: new Date().toISOString()
  };
  
  await update<Order>(STORES.ORDERS, updatedOrder);
  return updatedOrder;
};

// Delete an order
export const deleteOrder = async (id: string): Promise<void> => {
  await remove(STORES.ORDERS, id);
};

// Update order status
export const updateOrderStatus = async (id: string, status: OrderStatus): Promise<Order | null> => {
  const order = await getOrderById(id);
  
  if (order) {
    const updatedOrder = {
      ...order,
      status,
      updated_at: new Date().toISOString()
    };
    
    await update<Order>(STORES.ORDERS, updatedOrder);
    return updatedOrder;
  }
  
  return null;
};

// Create delivery for an order
export const createDelivery = async (orderId: string, deliveryDetails: any): Promise<Delivery | null> => {
  const order = await getOrderById(orderId);
  
  if (order) {
    const newDelivery: Delivery = {
      id: generateUUID(),
      order_id: orderId,
      status: 'assigned',
      address: deliveryDetails.address || order.shipping_address,
      district: deliveryDetails.district || '',
      city: deliveryDetails.city || '',
      postal_code: deliveryDetails.postal_code || '',
      delivery_date: deliveryDetails.delivery_date || '',
      estimated_delivery: deliveryDetails.estimated_delivery || '',
      notes: deliveryDetails.notes || '',
      fee: deliveryDetails.fee || 0,
      assigned_to: deliveryDetails.assigned_to || ''
    };
    
    // Now using the proper DELIVERIES store from STORES
    await add<Delivery>(STORES.DELIVERIES, newDelivery);
    
    // Update order with delivery
    const updatedOrder = {
      ...order,
      delivery: newDelivery,
      updated_at: new Date().toISOString()
    };
    
    await update<Order>(STORES.ORDERS, updatedOrder);
    
    return newDelivery;
  }
  
  return null;
};

// Update delivery status
export const updateDeliveryStatus = async (deliveryId: string, status: Delivery['status']): Promise<Delivery | null> => {
  // Now using the proper DELIVERIES store from STORES
  const delivery = await get<Delivery>(STORES.DELIVERIES, deliveryId);
  
  if (delivery) {
    const updatedDelivery = {
      ...delivery,
      status
    };
    
    await update<Delivery>(STORES.DELIVERIES, updatedDelivery);
    
    // Also update the delivery in the order
    const order = await getOrderById(delivery.order_id);
    
    if (order && order.delivery) {
      const updatedOrder = {
        ...order,
        delivery: updatedDelivery,
        updated_at: new Date().toISOString()
      };
      
      await update<Order>(STORES.ORDERS, updatedOrder);
    }
    
    return updatedDelivery;
  }
  
  return null;
};

// Get orders by user ID
export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  const orders = await getAllOrders();
  return orders.filter(order => order.user_id === userId);
};

// Initialize sample orders if needed
export const initializeSampleOrders = async (): Promise<void> => {
  const orders = await getAllOrders();
  
  if (orders.length === 0) {
    // Add sample orders here if needed
    console.log('No sample orders added');
  }
};

// Call initialization when the service is imported
initializeSampleOrders();
