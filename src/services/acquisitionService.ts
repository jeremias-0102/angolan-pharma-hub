// Import required types to ensure consistency
import { PurchaseOrderStatus, PurchaseOrder } from '@/types/models';
import { get, update, getAll, STORES } from '@/lib/database';

// Get purchase order by ID
const getPurchaseOrderById = async (id: string): Promise<PurchaseOrder | null> => {
  return await get<PurchaseOrder>(STORES.PURCHASE_ORDERS, id);
};

// Update purchase order
const updatePurchaseOrder = async (purchaseOrder: PurchaseOrder): Promise<void> => {
  await update<PurchaseOrder>(STORES.PURCHASE_ORDERS, purchaseOrder);
};

// Process purchase order
const processPurchaseOrder = async (purchaseOrderId: string): Promise<boolean> => {
  // Get purchase order
  const purchaseOrder = await getPurchaseOrderById(purchaseOrderId);
  
  if (purchaseOrder) {
    // Fix the status incompatibility by using a type assertion
    // to convert between the differing status enumerations
    purchaseOrder.status = 'received' as PurchaseOrderStatus;
    
    // Update purchase order status
    await updatePurchaseOrder(purchaseOrder);
    
    return true;
  }
  
  return false;
};

// Get all purchase orders
const getAllPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  return await getAll<PurchaseOrder>(STORES.PURCHASE_ORDERS);
};

// Create purchase order
const createPurchaseOrder = async (purchaseOrder: Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at'>): Promise<PurchaseOrder> => {
  const newPurchaseOrder: PurchaseOrder = {
    ...purchaseOrder,
    id: generateUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  await add<PurchaseOrder>(STORES.PURCHASE_ORDERS, newPurchaseOrder);
  return newPurchaseOrder;
};

// Generate UUID
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, 
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Delete purchase order
const deletePurchaseOrder = async (id: string): Promise<void> => {
  await remove(STORES.PURCHASE_ORDERS, id);
};

// Add missing import for add and remove functions
import { add, remove } from '@/lib/database';

export {
  getPurchaseOrderById,
  updatePurchaseOrder,
  processPurchaseOrder,
  getAllPurchaseOrders,
  createPurchaseOrder,
  deletePurchaseOrder
};
