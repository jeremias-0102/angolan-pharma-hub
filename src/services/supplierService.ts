
import { STORES, add, getAll, get, update, remove } from '@/lib/database';
import { Supplier } from '@/types/models';
import { v4 as uuidv4 } from 'uuid';

// Get all suppliers
export const getAllSuppliers = async (): Promise<Supplier[]> => {
  try {
    const suppliers = await getAll<Supplier>(STORES.SUPPLIERS);
    return suppliers;
  } catch (error) {
    console.error('Error getting all suppliers:', error);
    throw error;
  }
};

// Get supplier by ID
export const getSupplierById = async (id: string): Promise<Supplier | null> => {
  try {
    const supplier = await get<Supplier>(STORES.SUPPLIERS, id);
    return supplier;
  } catch (error) {
    console.error(`Error getting supplier with ID ${id}:`, error);
    throw error;
  }
};

// Create a new supplier
export const addSupplier = async (supplier: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>): Promise<Supplier> => {
  try {
    const now = new Date().toISOString();
    const newSupplier: Supplier = {
      id: uuidv4(),
      ...supplier,
      created_at: now,
      updated_at: now
    };
    
    const result = await add<Supplier>(STORES.SUPPLIERS, newSupplier);
    return result;
  } catch (error) {
    console.error('Error creating supplier:', error);
    throw error;
  }
};

// Update a supplier
export const updateSupplier = async (supplier: Supplier): Promise<Supplier> => {
  try {
    supplier.updated_at = new Date().toISOString();
    const result = await update<Supplier>(STORES.SUPPLIERS, supplier);
    return result;
  } catch (error) {
    console.error(`Error updating supplier ${supplier.id}:`, error);
    throw error;
  }
};

// Delete a supplier
export const deleteSupplier = async (id: string): Promise<void> => {
  try {
    await remove(STORES.SUPPLIERS, id);
  } catch (error) {
    console.error(`Error deleting supplier ${id}:`, error);
    throw error;
  }
};
