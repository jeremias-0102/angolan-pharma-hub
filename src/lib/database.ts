
import { User, Product, Order, Batch, Supplier, PurchaseOrder, Category, Prescription, FinancialTransaction, Notification, SystemSettings, StockAlert, MulticaixaPayment, CommunicationLog, AIConversation } from '@/types/models';

// Database configuration
const DB_NAME = 'pharmagestDB';
const DB_VERSION = 3; // Increased version for new schema

// Store names
export const STORES = {
  USERS: 'users',
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  ORDERS: 'orders',
  BATCHES: 'batches',
  SUPPLIERS: 'suppliers',
  PURCHASE_ORDERS: 'purchase_orders',
  PRESCRIPTIONS: 'prescriptions',
  FINANCIAL_TRANSACTIONS: 'financial_transactions',
  NOTIFICATIONS: 'notifications',
  SETTINGS: 'settings',
  DELIVERIES: 'deliveries',
  STOCK_ALERTS: 'stock_alerts',
  MULTICAIXA_PAYMENTS: 'multicaixa_payments',
  COMMUNICATION_LOGS: 'communication_logs',
  AI_CONVERSATIONS: 'ai_conversations'
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
      
      // Create stores if they don't exist (initial version)
      if (oldVersion < 1) {
        if (!db.objectStoreNames.contains(STORES.USERS)) {
          const usersStore = db.createObjectStore(STORES.USERS, { keyPath: 'id' });
          usersStore.createIndex('email', 'email', { unique: true });
          usersStore.createIndex('role', 'role', { unique: false });
          usersStore.createIndex('is_active', 'is_active', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.CATEGORIES)) {
          const categoriesStore = db.createObjectStore(STORES.CATEGORIES, { keyPath: 'id' });
          categoriesStore.createIndex('name', 'name', { unique: false });
          categoriesStore.createIndex('parent_id', 'parent_id', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.PRODUCTS)) {
          const productsStore = db.createObjectStore(STORES.PRODUCTS, { keyPath: 'id' });
          productsStore.createIndex('code', 'code', { unique: true });
          productsStore.createIndex('category_id', 'category_id', { unique: false });
          productsStore.createIndex('supplier_id', 'supplier_id', { unique: false });
          productsStore.createIndex('requiresPrescription', 'requiresPrescription', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.ORDERS)) {
          const ordersStore = db.createObjectStore(STORES.ORDERS, { keyPath: 'id' });
          ordersStore.createIndex('user_id', 'user_id', { unique: false });
          ordersStore.createIndex('status', 'status', { unique: false });
          ordersStore.createIndex('payment_status', 'payment_status', { unique: false });
          ordersStore.createIndex('created_at', 'created_at', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.BATCHES)) {
          const batchesStore = db.createObjectStore(STORES.BATCHES, { keyPath: 'id' });
          batchesStore.createIndex('product_id', 'product_id', { unique: false });
          batchesStore.createIndex('expiry_date', 'expiry_date', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.SUPPLIERS)) {
          const suppliersStore = db.createObjectStore(STORES.SUPPLIERS, { keyPath: 'id' });
          suppliersStore.createIndex('name', 'name', { unique: false });
          suppliersStore.createIndex('is_active', 'is_active', { unique: false });
        }
      }
      
      // Version 2 upgrades
      if (oldVersion < 2) {
        if (!db.objectStoreNames.contains(STORES.PURCHASE_ORDERS)) {
          const purchaseOrdersStore = db.createObjectStore(STORES.PURCHASE_ORDERS, { keyPath: 'id' });
          purchaseOrdersStore.createIndex('supplier_id', 'supplier_id', { unique: false });
          purchaseOrdersStore.createIndex('status', 'status', { unique: false });
        }
        
        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          db.createObjectStore(STORES.SETTINGS, { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains(STORES.DELIVERIES)) {
          const deliveriesStore = db.createObjectStore(STORES.DELIVERIES, { keyPath: 'id' });
          deliveriesStore.createIndex('order_id', 'order_id', { unique: false });
          deliveriesStore.createIndex('status', 'status', { unique: false });
          deliveriesStore.createIndex('assigned_to', 'assigned_to', { unique: false });
        }
      }

      // Version 3 upgrades - New pharmacy management features
      if (oldVersion < 3) {
        if (!db.objectStoreNames.contains(STORES.PRESCRIPTIONS)) {
          const prescriptionsStore = db.createObjectStore(STORES.PRESCRIPTIONS, { keyPath: 'id' });
          prescriptionsStore.createIndex('order_id', 'order_id', { unique: false });
          prescriptionsStore.createIndex('validated', 'validated', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.FINANCIAL_TRANSACTIONS)) {
          const financialStore = db.createObjectStore(STORES.FINANCIAL_TRANSACTIONS, { keyPath: 'id' });
          financialStore.createIndex('type', 'type', { unique: false });
          financialStore.createIndex('category', 'category', { unique: false });
          financialStore.createIndex('date', 'date', { unique: false });
          financialStore.createIndex('created_by', 'created_by', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.NOTIFICATIONS)) {
          const notificationsStore = db.createObjectStore(STORES.NOTIFICATIONS, { keyPath: 'id' });
          notificationsStore.createIndex('user_id', 'user_id', { unique: false });
          notificationsStore.createIndex('read', 'read', { unique: false });
          notificationsStore.createIndex('type', 'type', { unique: false });
          notificationsStore.createIndex('created_at', 'created_at', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.STOCK_ALERTS)) {
          const stockAlertsStore = db.createObjectStore(STORES.STOCK_ALERTS, { keyPath: 'id' });
          stockAlertsStore.createIndex('product_id', 'product_id', { unique: false });
          stockAlertsStore.createIndex('alert_type', 'alert_type', { unique: false });
          stockAlertsStore.createIndex('resolved', 'resolved', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.MULTICAIXA_PAYMENTS)) {
          const paymentsStore = db.createObjectStore(STORES.MULTICAIXA_PAYMENTS, { keyPath: 'id' });
          paymentsStore.createIndex('order_id', 'order_id', { unique: false });
          paymentsStore.createIndex('status', 'status', { unique: false });
          paymentsStore.createIndex('reference', 'reference', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.COMMUNICATION_LOGS)) {
          const communicationStore = db.createObjectStore(STORES.COMMUNICATION_LOGS, { keyPath: 'id' });
          communicationStore.createIndex('recipient', 'recipient', { unique: false });
          communicationStore.createIndex('type', 'type', { unique: false });
          communicationStore.createIndex('status', 'status', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.AI_CONVERSATIONS)) {
          const aiStore = db.createObjectStore(STORES.AI_CONVERSATIONS, { keyPath: 'id' });
          aiStore.createIndex('user_id', 'user_id', { unique: false });
          aiStore.createIndex('session_id', 'session_id', { unique: false });
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

// Bulk operations for better performance
export async function bulkAdd<T>(storeName: string, items: T[]): Promise<T[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    let completed = 0;
    
    items.forEach(item => {
      const request = store.add(item);
      request.onsuccess = () => {
        completed++;
        if (completed === items.length) {
          resolve(items);
          db.close();
        }
      };
      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
        db.close();
      };
    });
  });
}

// Query with filters
export async function queryWithFilters<T>(
  storeName: string, 
  filters: { [key: string]: any }
): Promise<T[]> {
  const allItems = await getAll<T>(storeName);
  
  return allItems.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      return (item as any)[key] === value;
    });
  });
}

// Initialize database when the file is imported
initDB().catch(error => {
  console.error('Failed to initialize database:', error);
});
