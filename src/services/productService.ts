import { v4 as uuidv4 } from 'uuid';
import { Product } from '@/types/models';
import { add, getAll, update, get, remove, getNextSequenceValue, STORES } from '@/lib/database';

// Atualiza para usar código autoincremental
export const createProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'updated_at' | 'code'>): Promise<Product> => {
  // Gera código autoincrementado
  const code = await getNextSequenceValue('product_code');
  
  const now = new Date().toISOString();
  const product: Product = {
    ...productData,
    id: uuidv4(),
    code: code.toString(), // Usando código gerado automaticamente
    created_at: now,
    updated_at: now,
    batches: [],
  };

  await add(STORES.PRODUCTS, product);
  return product;
};

// Listar todos os produtos
export const getAllProducts = async (): Promise<Product[]> => {
  return await getAll<Product>(STORES.PRODUCTS);
};

// Obter um produto pelo ID
export const getProductById = async (id: string): Promise<Product | null> => {
  return await get<Product>(STORES.PRODUCTS, id);
};

// Atualizar um produto
export const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
  const product = await get<Product>(STORES.PRODUCTS, id);
  if (!product) {
    throw new Error('Produto não encontrado');
  }

  const updatedProduct = {
    ...product,
    ...productData,
    updated_at: new Date().toISOString()
  };

  await update(STORES.PRODUCTS, updatedProduct);
  return updatedProduct;
};

// Excluir um produto
export const deleteProduct = async (id: string): Promise<void> => {
  await remove(STORES.PRODUCTS, id);
};
