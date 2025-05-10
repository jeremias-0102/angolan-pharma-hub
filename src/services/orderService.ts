
import { STORES, add, getAll, get, update, remove, getByIndex } from '@/lib/database';
import { Order } from '@/types/models';
import { v4 as uuidv4 } from 'uuid';

// Get all orders
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const orders = await getAll<Order>(STORES.ORDERS);
    return orders;
  } catch (error) {
    console.error('Error getting all orders:', error);
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (id: string): Promise<Order | null> => {
  try {
    const order = await get<Order>(STORES.ORDERS, id);
    return order;
  } catch (error) {
    console.error(`Error getting order with ID ${id}:`, error);
    throw error;
  }
};

// Get orders by user ID
export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  try {
    const orders = await getByIndex<Order>(STORES.ORDERS, 'user_id', userId);
    return orders;
  } catch (error) {
    console.error(`Error getting orders for user ${userId}:`, error);
    throw error;
  }
};

// Create a new order
export const createOrder = async (order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order> => {
  try {
    const now = new Date().toISOString();
    const newOrder: Order = {
      id: uuidv4(),
      ...order,
      created_at: now,
      updated_at: now
    };
    
    const result = await add<Order>(STORES.ORDERS, newOrder);
    return result;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Update an order
export const updateOrder = async (order: Order): Promise<Order> => {
  try {
    order.updated_at = new Date().toISOString();
    const result = await update<Order>(STORES.ORDERS, order);
    return result;
  } catch (error) {
    console.error(`Error updating order ${order.id}:`, error);
    throw error;
  }
};

// Delete an order
export const deleteOrder = async (id: string): Promise<void> => {
  try {
    await remove(STORES.ORDERS, id);
  } catch (error) {
    console.error(`Error deleting order ${id}:`, error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (
  id: string, 
  status: 'pending' | 'paid' | 'processing' | 'ready' | 'shipping' | 'delivered' | 'cancelled'
): Promise<Order> => {
  try {
    const order = await getOrderById(id);
    if (!order) {
      throw new Error(`Order with ID ${id} not found`);
    }
    
    order.status = status;
    order.updated_at = new Date().toISOString();
    
    const updatedOrder = await update<Order>(STORES.ORDERS, order);
    return updatedOrder;
  } catch (error) {
    console.error(`Error updating status for order ${id}:`, error);
    throw error;
  }
};
