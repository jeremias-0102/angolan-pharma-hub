
import { User, Product, Order, Batch, Supplier, PurchaseOrder, Category } from '@/types/models';

// Database configuration
const DB_NAME = 'pharmagestDB';
const DB_VERSION = 3; // Increased version for schema update to include categories

// Store names
export const STORES = {
  USERS: 'users',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  BATCHES: 'batches',
  SUPPLIERS: 'suppliers',
  PURCHASE_ORDERS: 'purchase_orders',
  SETTINGS: 'settings',
  DELIVERIES: 'deliveries', // Added deliveries store
  CATEGORIES: 'categories' // Adding categories store
};

// Initialize database
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('Database error:', (event.target as IDBRequest).error);
      reject((event.target as IDBRequest).error);
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const oldVersion = event.oldVersion;
      
      // Create or update stores
      if (oldVersion < 1) {
        // Create stores if they don't exist (initial version)
        if (!db.objectStoreNames.contains(STORES.USERS)) {
          const usersStore = db.createObjectStore(STORES.USERS, { keyPath: 'id' });
          usersStore.createIndex('email', 'email', { unique: true });
          usersStore.createIndex('role', 'role', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.PRODUCTS)) {
          const productsStore = db.createObjectStore(STORES.PRODUCTS, { keyPath: 'id' });
          productsStore.createIndex('code', 'code', { unique: true });
          productsStore.createIndex('category', 'category', { unique: false });
          // Add category_id index for relationship
          productsStore.createIndex('category_id', 'category_id', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.ORDERS)) {
          const ordersStore = db.createObjectStore(STORES.ORDERS, { keyPath: 'id' });
          ordersStore.createIndex('user_id', 'user_id', { unique: false });
          ordersStore.createIndex('status', 'status', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.BATCHES)) {
          const batchesStore = db.createObjectStore(STORES.BATCHES, { keyPath: 'id' });
          batchesStore.createIndex('product_id', 'product_id', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.SUPPLIERS)) {
          const suppliersStore = db.createObjectStore(STORES.SUPPLIERS, { keyPath: 'id' });
          suppliersStore.createIndex('name', 'name', { unique: false });
        }
      }
      
      // Version 2 upgrades
      if (oldVersion < 2) {
        // Add purchase orders store
        if (!db.objectStoreNames.contains(STORES.PURCHASE_ORDERS)) {
          const purchaseOrdersStore = db.createObjectStore(STORES.PURCHASE_ORDERS, { keyPath: 'id' });
          purchaseOrdersStore.createIndex('supplier_id', 'supplier_id', { unique: false });
          purchaseOrdersStore.createIndex('status', 'status', { unique: false });
          purchaseOrdersStore.createIndex('created_by', 'created_by', { unique: false });
        }
        
        // Add settings store
        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          db.createObjectStore(STORES.SETTINGS, { keyPath: 'id' });
        }
      }
      
      // Version 3 upgrades - add categories store
      if (oldVersion < 3) {
        if (!db.objectStoreNames.contains(STORES.CATEGORIES)) {
          const categoriesStore = db.createObjectStore(STORES.CATEGORIES, { keyPath: 'id' });
          categoriesStore.createIndex('name', 'name', { unique: true });
          categoriesStore.createIndex('parent_id', 'parent_id', { unique: false });
          categoriesStore.createIndex('is_active', 'is_active', { unique: false });
        }
      }
    };
  });
};

// Generic database operations
export async function add<T>(storeName: string, data: T): Promise<T> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add(data);

    request.onsuccess = () => {
      resolve(data);
      db.close();
    };

    request.onerror = (event) => {
      reject((event.target as IDBRequest).error);
      db.close();
    };
  });
}

export async function update<T>(storeName: string, data: T): Promise<T> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(data);

    request.onsuccess = () => {
      resolve(data);
      db.close();
    };

    request.onerror = (event) => {
      reject((event.target as IDBRequest).error);
      db.close();
    };
  });
}

export async function get<T>(storeName: string, id: string | number): Promise<T | null> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);

    request.onsuccess = () => {
      resolve(request.result || null);
      db.close();
    };

    request.onerror = (event) => {
      reject((event.target as IDBRequest).error);
      db.close();
    };
  });
}

export async function remove(storeName: string, id: string | number): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
      db.close();
    };

    request.onerror = (event) => {
      reject((event.target as IDBRequest).error);
      db.close();
    };
  });
}

export async function getAll<T>(storeName: string): Promise<T[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
      db.close();
    };

    request.onerror = (event) => {
      reject((event.target as IDBRequest).error);
      db.close();
    };
  });
}

export async function getByIndex<T>(storeName: string, indexName: string, value: string | number): Promise<T[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    const request = index.getAll(value);

    request.onsuccess = () => {
      resolve(request.result);
      db.close();
    };

    request.onerror = (event) => {
      reject((event.target as IDBRequest).error);
      db.close();
    };
  });
}

// Initialize database when the file is imported
initDB().catch(error => {
  console.error('Failed to initialize database:', error);
});
