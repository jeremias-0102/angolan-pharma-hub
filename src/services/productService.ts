import { Product, Batch } from '@/types/models';
import { add, update, get, remove, getAll, STORES } from '@/lib/database';
import { v4 as uuidv4 } from 'uuid';

// Save image to IndexedDB
export const saveImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // The result is a base64 string representing the file
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  return await getAll<Product>(STORES.PRODUCTS);
};

// Get product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  return await get<Product>(STORES.PRODUCTS, id);
};

// Add a new product
export const addProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
  const newProduct: Product = {
    ...product,
    id: uuidv4(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  await add<Product>(STORES.PRODUCTS, newProduct);
  return newProduct;
};

// Update a product
export const updateProduct = async (product: Product): Promise<Product> => {
  const updatedProduct = {
    ...product,
    updated_at: new Date().toISOString()
  };
  
  await update<Product>(STORES.PRODUCTS, updatedProduct);
  return updatedProduct;
};

// Delete a product
export const deleteProduct = async (id: string): Promise<void> => {
  await remove(STORES.PRODUCTS, id);
};

// Add batch to product
export const addBatch = async (batch: Omit<Batch, 'id' | 'created_at'>): Promise<Batch> => {
  const newBatch: Batch = {
    ...batch,
    id: uuidv4(),
    created_at: new Date().toISOString()
  };
  
  // Add batch to the batches store
  await add<Batch>(STORES.BATCHES, newBatch);
  
  // Update the product with the new batch
  const product = await getProductById(batch.product_id);
  
  if (product) {
    const updatedProduct = {
      ...product,
      batches: [...(product.batches || []), newBatch],
      updated_at: new Date().toISOString()
    };
    
    await update<Product>(STORES.PRODUCTS, updatedProduct);
  }
  
  return newBatch;
};

// Get batches for a product
export const getBatchesByProductId = async (productId: string): Promise<Batch[]> => {
  const product = await getProductById(productId);
  return product?.batches || [];
};

// Delete batch
export const deleteBatch = async (batchId: string, productId: string): Promise<void> => {
  // Remove batch from batches store
  await remove(STORES.BATCHES, batchId);
  
  // Update product's batches array
  const product = await getProductById(productId);
  
  if (product && product.batches) {
    const updatedBatches = product.batches.filter(b => b.id !== batchId);
    
    const updatedProduct = {
      ...product,
      batches: updatedBatches,
      updated_at: new Date().toISOString()
    };
    
    await update<Product>(STORES.PRODUCTS, updatedProduct);
  }
};

// Initialize products with sample data if needed
export const initializeSampleProducts = async (): Promise<void> => {
  const products = await getAllProducts();
  
  if (products.length === 0) {
    const sampleProducts: Product[] = [
      {
        id: uuidv4(),
        code: 'MED-001',
        name: 'Paracetamol 500mg',
        description: 'Analgésico e antipirético para alívio de dores leves e moderadas.',
        price_cost: 200,
        price_sale: 350,
        category_id: 'cat-001',
        supplier_id: 'sup-001',
        manufacturer: 'Pharma Inc.',
        requiresPrescription: false,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFyYWNldGFtb2x8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        batches: [],
        stock: 150
      },
      {
        id: uuidv4(),
        code: 'MED-002',
        name: 'Amoxicilina 500mg',
        description: 'Antibiótico para tratamento de infecções bacterianas.',
        price_cost: 400,
        price_sale: 650,
        category_id: 'cat-002',
        supplier_id: 'sup-001',
        manufacturer: 'MedLab Angola',
        requiresPrescription: true,
        image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fG1lZGljaW5lfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        batches: [],
        stock: 80
      },
      {
        id: uuidv4(),
        code: 'MED-003',
        name: 'Ibuprofeno 400mg',
        description: 'Anti-inflamatório não esteroidal para dor e inflamação.',
        price_cost: 250,
        price_sale: 420,
        category_id: 'cat-003',
        supplier_id: 'sup-002',
        manufacturer: 'Pharma Angola',
        requiresPrescription: false,
        image: 'https://images.unsplash.com/photo-1550572017-26b5655c6527?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bWVkaWNpbmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        batches: [],
        stock: 120
      }
    ];
    
    // Add sample batches to products
    const batch1: Batch = {
      id: uuidv4(),
      product_id: sampleProducts[0].id,
      batch_number: 'B2023-001',
      quantity: 150,
      cost_price: 200,
      manufacture_date: '2022-12-01T00:00:00Z',
      expiry_date: '2024-12-01T00:00:00Z',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const batch2: Batch = {
      id: uuidv4(),
      product_id: sampleProducts[1].id,
      batch_number: 'B2023-002',
      quantity: 80,
      cost_price: 400,
      manufacture_date: '2022-11-15T00:00:00Z',
      expiry_date: '2024-11-15T00:00:00Z',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    const batch3: Batch = {
      id: uuidv4(),
      product_id: sampleProducts[2].id,
      batch_number: 'B2023-003',
      quantity: 120,
      cost_price: 250,
      manufacture_date: '2022-12-20T00:00:00Z',
      expiry_date: '2024-12-20T00:00:00Z',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    sampleProducts[0].batches = [batch1];
    sampleProducts[1].batches = [batch2];
    sampleProducts[2].batches = [batch3];
    
    // Add products to database
    for (const product of sampleProducts) {
      await add<Product>(STORES.PRODUCTS, product);
    }
    
    // Add batches to database
    await add<Batch>(STORES.BATCHES, batch1);
    await add<Batch>(STORES.BATCHES, batch2);
    await add<Batch>(STORES.BATCHES, batch3);
    
    console.log('Sample products added successfully');
  }
};

// Call initialization when the service is imported
initializeSampleProducts();
