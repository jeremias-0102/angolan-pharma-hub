import { STORES, add, getAll, get, update, remove, getByIndex } from '@/lib/database';
import { PurchaseOrder, PurchaseOrderItem, PurchaseOrderStatus, Product, Batch } from '@/types/models';
import { v4 as uuidv4 } from 'uuid';
import { getProductById, updateProduct } from './productService';

// Get all purchase orders
export const getAllPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  try {
    const orders = await getAll<PurchaseOrder>(STORES.PURCHASE_ORDERS);
    return orders;
  } catch (error) {
    console.error('Error getting all purchase orders:', error);
    throw error;
  }
};

// Get purchase order by ID
export const getPurchaseOrderById = async (id: string): Promise<PurchaseOrder | null> => {
  try {
    const order = await get<PurchaseOrder>(STORES.PURCHASE_ORDERS, id);
    return order;
  } catch (error) {
    console.error(`Error getting purchase order with ID ${id}:`, error);
    throw error;
  }
};

// Get purchase orders by supplier ID
export const getPurchaseOrdersBySupplierId = async (supplierId: string): Promise<PurchaseOrder[]> => {
  try {
    const orders = await getByIndex<PurchaseOrder>(STORES.PURCHASE_ORDERS, 'supplier_id', supplierId);
    return orders;
  } catch (error) {
    console.error(`Error getting purchase orders for supplier ${supplierId}:`, error);
    throw error;
  }
};

// Create a new purchase order
export const createPurchaseOrder = async (purchaseOrder: Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at'>): Promise<PurchaseOrder> => {
  try {
    const now = new Date().toISOString();
    const newOrder: PurchaseOrder = {
      id: uuidv4(),
      ...purchaseOrder,
      created_at: now,
      updated_at: now
    };
    
    const result = await add<PurchaseOrder>(STORES.PURCHASE_ORDERS, newOrder);
    return result;
  } catch (error) {
    console.error('Error creating purchase order:', error);
    throw error;
  }
};

// Update a purchase order
export const updatePurchaseOrder = async (purchaseOrder: PurchaseOrder): Promise<PurchaseOrder> => {
  try {
    purchaseOrder.updated_at = new Date().toISOString();
    const result = await update<PurchaseOrder>(STORES.PURCHASE_ORDERS, purchaseOrder);
    return result;
  } catch (error) {
    console.error(`Error updating purchase order ${purchaseOrder.id}:`, error);
    throw error;
  }
};

// Delete a purchase order
export const deletePurchaseOrder = async (id: string): Promise<void> => {
  try {
    await remove(STORES.PURCHASE_ORDERS, id);
  } catch (error) {
    console.error(`Error deleting purchase order ${id}:`, error);
    throw error;
  }
};

// Process received items
export const receiveItems = async (purchaseOrderId: string, itemsReceived: PurchaseOrderItem[]): Promise<PurchaseOrder> => {
  try {
    // Get the purchase order
    const purchaseOrder = await getPurchaseOrderById(purchaseOrderId);
    if (!purchaseOrder) {
      throw new Error(`Purchase order with ID ${purchaseOrderId} not found`);
    }
    
    // Update the purchase order items
    const updatedItems = purchaseOrder.items.map(item => {
      const receivedItem = itemsReceived.find(i => i.id === item.id);
      if (receivedItem) {
        return {
          ...item,
          quantity_received: item.quantity_received + receivedItem.quantity_received,
          batch_number: receivedItem.batch_number || item.batch_number,
          expiry_date: receivedItem.expiry_date || item.expiry_date
        };
      }
      return item;
    });
    
    // Update purchase order status
    let status: 'draft' | 'sent' | 'partial' | 'complete' | 'cancelled' = purchaseOrder.status;
    
    // Check if all items are fully received
    const allReceived = updatedItems.every(item => item.quantity_received >= item.quantity_ordered);
    const anyReceived = updatedItems.some(item => item.quantity_received > 0);
    
    if (allReceived) {
      status = 'complete';
    } else if (anyReceived) {
      status = 'partial';
    }
    
    // Update the purchase order
    const updatedPurchaseOrder: PurchaseOrder = {
      ...purchaseOrder,
      items: updatedItems,
      status,
      updated_at: new Date().toISOString()
    };
    
    // Save the updated purchase order
    await update<PurchaseOrder>(STORES.PURCHASE_ORDERS, updatedPurchaseOrder);
    
    // Update product inventory with new batches
    for (const item of itemsReceived) {
      if (item.quantity_received > 0 && item.batch_number && item.expiry_date) {
        await addProductBatch(
          item.product_id, 
          item.batch_number, 
          item.quantity_received,
          item.expiry_date
        );
      }
    }
    
    return updatedPurchaseOrder;
  } catch (error) {
    console.error(`Error receiving items for purchase order ${purchaseOrderId}:`, error);
    throw error;
  }
};

// Helper to add a new batch to a product
const addProductBatch = async (
  productId: string, 
  batchNumber: string, 
  quantity: number,
  expiryDate: string
): Promise<void> => {
  try {
    // Get the product
    const product = await getProductById(productId);
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }
    
    // Create a new batch
    const newBatch: Batch = {
      id: uuidv4(),
      product_id: productId,
      batch_number: batchNumber,
      quantity,
      manufacture_date: new Date().toISOString(), // Default to today
      expiry_date: expiryDate,
      created_at: new Date().toISOString()
    };
    
    // Add the batch to the product
    const batches = product.batches || [];
    const updatedProduct: Product = {
      ...product,
      batches: [...batches, newBatch]
    };
    
    // Update the product
    await updateProduct(updatedProduct);
  } catch (error) {
    console.error(`Error adding batch to product ${productId}:`, error);
    throw error;
  }
};

// Get summary of pending orders
export const getPendingOrdersSummary = async (): Promise<{ 
  count: number;
  totalValue: number;
}> => {
  try {
    const orders = await getAllPurchaseOrders();
    const pendingOrders = orders.filter(order => 
      order.status === 'sent' || order.status === 'partial'
    );
    
    const count = pendingOrders.length;
    const totalValue = pendingOrders.reduce((sum, order) => sum + order.total, 0);
    
    return { count, totalValue };
  } catch (error) {
    console.error('Error getting pending orders summary:', error);
    throw error;
  }
};

// Get completed orders for a date range
export const getCompletedOrdersForPeriod = async (
  startDate: string,
  endDate: string
): Promise<PurchaseOrder[]> => {
  try {
    const orders = await getAllPurchaseOrders();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    
    return orders.filter(order => {
      const orderDate = new Date(order.updated_at).getTime();
      return order.status === 'complete' && orderDate >= start && orderDate <= end;
    });
  } catch (error) {
    console.error('Error getting completed orders for period:', error);
    throw error;
  }
};

// Update a purchase order status
export const updatePurchaseOrderStatus = async (
  id: string,
  newStatus: PurchaseOrderStatus
): Promise<PurchaseOrder> => {
  const order = await get<PurchaseOrder>(STORES.PURCHASE_ORDERS, id);
  if (!order) {
    throw new Error(`Purchase order with id ${id} not found`);
  }
  
  order.status = newStatus;
  order.updated_at = new Date().toISOString();
  
  return await update<PurchaseOrder>(STORES.PURCHASE_ORDERS, order);
};
