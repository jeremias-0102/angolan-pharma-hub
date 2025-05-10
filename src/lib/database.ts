
import { User, Product, Order, Batch, Supplier } from '@/types/models';

// Database configuration
const DB_NAME = 'pharmagestDB';
const DB_VERSION = 1;

// Store names
export const STORES = {
  USERS: 'users',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  BATCHES: 'batches',
  SUPPLIERS: 'suppliers',
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
      
      // Create stores if they don't exist
      if (!db.objectStoreNames.contains(STORES.USERS)) {
        const usersStore = db.createObjectStore(STORES.USERS, { keyPath: 'id' });
        usersStore.createIndex('email', 'email', { unique: true });
        usersStore.createIndex('role', 'role', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.PRODUCTS)) {
        const productsStore = db.createObjectStore(STORES.PRODUCTS, { keyPath: 'id' });
        productsStore.createIndex('code', 'code', { unique: true });
        productsStore.createIndex('category', 'category', { unique: false });
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
