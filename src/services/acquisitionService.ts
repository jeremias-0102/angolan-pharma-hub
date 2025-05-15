
import { PurchaseOrderStatus, PurchaseOrder, Supplier } from '@/types/models';
import { get, update, getAll, add, remove, STORES } from '@/lib/database';
import { getAllSuppliers } from './supplierService';
import { generateUUID } from '@/types/models';

// Get purchase order by ID
export const getPurchaseOrderById = async (id: string): Promise<PurchaseOrder | null> => {
  return await get<PurchaseOrder>(STORES.PURCHASE_ORDERS, id);
};

// Update purchase order
export const updatePurchaseOrder = async (purchaseOrder: PurchaseOrder): Promise<void> => {
  await update<PurchaseOrder>(STORES.PURCHASE_ORDERS, purchaseOrder);
};

// Process purchase order
export const processPurchaseOrder = async (purchaseOrderId: string): Promise<boolean> => {
  // Get purchase order
  const purchaseOrder = await getPurchaseOrderById(purchaseOrderId);
  
  if (purchaseOrder) {
    // Fix the status incompatibility by using a type assertion
    purchaseOrder.status = 'received' as PurchaseOrderStatus;
    
    // Update purchase order status
    await updatePurchaseOrder(purchaseOrder);
    
    return true;
  }
  
  return false;
};

// Get all purchase orders
export const getAllPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  return await getAll<PurchaseOrder>(STORES.PURCHASE_ORDERS);
};

// Get all suppliers for acquisitions
export const getSuppliersForAcquisitions = async (): Promise<Supplier[]> => {
  return await getAllSuppliers();
};

// Create purchase order
export const createPurchaseOrder = async (purchaseOrder: Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at'>): Promise<PurchaseOrder> => {
  const newPurchaseOrder: PurchaseOrder = {
    ...purchaseOrder,
    id: generateUUID(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  await add<PurchaseOrder>(STORES.PURCHASE_ORDERS, newPurchaseOrder);
  return newPurchaseOrder;
};

// Delete purchase order
export const deletePurchaseOrder = async (id: string): Promise<void> => {
  await remove(STORES.PURCHASE_ORDERS, id);
};

export {
  // Export functions
};
