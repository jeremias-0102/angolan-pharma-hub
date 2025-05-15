
import { v4 as uuidv4 } from 'uuid';
import { Supplier } from '@/types/models';
import { add, getAll, update, get, remove, getNextSequenceValue, STORES } from '@/lib/database';

// Listar fornecedores
export const getAllSuppliers = async (): Promise<Supplier[]> => {
  return await getAll<Supplier>(STORES.SUPPLIERS);
};

// Obter um fornecedor
export const getSupplierById = async (id: string): Promise<Supplier | null> => {
  return await get<Supplier>(STORES.SUPPLIERS, id);
};

// Criar fornecedor
export const createSupplier = async (supplierData: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>): Promise<Supplier> => {
  // Gera código fiscal autoincrementado (tax_id)
  const taxId = await getNextSequenceValue('supplier_code');
  
  const now = new Date().toISOString();
  const supplier: Supplier = {
    ...supplierData,
    id: uuidv4(),
    tax_id: supplierData.tax_id || `SUPP-${taxId}`, // Usar valor autogerado se não for fornecido
    created_at: now,
    updated_at: now
  };

  await add(STORES.SUPPLIERS, supplier);
  return supplier;
};

// Function needed for PurchaseOrderFormModal
export const addSupplier = async (supplierData: Supplier): Promise<Supplier> => {
  await add(STORES.SUPPLIERS, supplierData);
  return supplierData;
};

// Atualizar fornecedor
export const updateSupplier = async (id: string, supplierData: Partial<Supplier>): Promise<Supplier> => {
  const supplier = await get<Supplier>(STORES.SUPPLIERS, id);
  if (!supplier) {
    throw new Error('Fornecedor não encontrado');
  }

  const updatedSupplier = {
    ...supplier,
    ...supplierData,
    updated_at: new Date().toISOString()
  };

  await update(STORES.SUPPLIERS, updatedSupplier);
  return updatedSupplier;
};

// Excluir fornecedor
export const deleteSupplier = async (id: string): Promise<void> => {
  await remove(STORES.SUPPLIERS, id);
};
