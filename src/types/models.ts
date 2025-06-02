
// Product related types
export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  price_cost: number;
  price_sale: number;
  price_compare?: number;
  price?: number;
  category_id: string;
  supplier_id: string;
  manufacturer: string;
  requiresPrescription: boolean;
  needsPrescription?: boolean;
  image?: string;
  stock: number;
  created_at: string;
  updated_at: string;
  batches: Batch[];
  active_ingredient?: string;
  dosage?: string;
  form?: string;
  details?: string;
  usage_instructions?: string;
  general_info?: string;
  quantity?: number;
  tags?: string[]; // Para busca inteligente por sintomas
  category?: Category;
  supplier?: Supplier;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Batch {
  id: string;
  product_id: string;
  batch_number: string;
  quantity: number;
  cost_price: number;
  manufacture_date: string;
  expiry_date: string;
  created_at: string;
  updated_at: string;
}

// Cart related types
export interface CartProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  price_sale: number;
  image?: string;
  stock: number;
  needsPrescription: boolean;
  quantity: number;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
}

// Order related types
export type OrderStatus = "pending" | "confirmed" | "processing" | "ready" | "shipping" | "delivered" | "cancelled";
export type PaymentMethod = "multicaixa" | "card" | "cash_on_delivery";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  total: number;
  items: OrderItem[];
  shipping_address: string;
  shipping_details: any;
  created_at: string;
  updated_at: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  requires_prescription: boolean;
  prescription_image?: string;
  discount: number;
  notes?: string;
  delivery?: Delivery;
  prescription?: Prescription;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  unit_price: number;
  total: number;
}

// Prescription management
export interface Prescription {
  id: string;
  order_id: string;
  image_file: string;
  pdf_file?: string;
  extracted_text?: string;
  upload_date: string;
  validated: boolean;
  validated_by?: string;
  validation_date?: string;
  created_at: string;
  updated_at: string;
}

// Delivery management
export interface Delivery {
  id: string;
  order_id: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'delivered' | 'failed';
  address: string;
  district?: string;
  city?: string;
  postal_code?: string;
  delivery_date?: string;
  estimated_delivery?: string;
  actual_delivery?: string;
  notes?: string;
  fee: number;
  assigned_to: string;
  route_data?: any; // Google Maps route information
}

// User related types
export type UserRole = 'admin' | 'pharmacist' | 'delivery' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  address?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  last_login?: string;
  vehicle_info?: string; // For delivery users
}

// Supplier related types
export interface Supplier {
  id: string;
  name: string;
  contact_name?: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  tax_id: string;
}

// Purchase order related types
export type PurchaseOrderStatus = 'draft' | 'submitted' | 'received' | 'cancelled' | 'sent' | 'partial' | 'complete';

export interface PurchaseOrder {
  id: string;
  supplier_id: string;
  supplier_name: string;
  status: PurchaseOrderStatus;
  order_date: string;
  expected_delivery: string;
  actual_delivery?: string;
  total: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  items: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id: string;
  purchase_order_id: string;
  product_id: string;
  product_name: string;
  quantity_ordered: number;
  quantity_received: number;
  unit_price: number;
  total: number;
  batch_number?: string;
  expiry_date?: string;
}

export interface ReceivableItem extends PurchaseOrderItem {
  currentReceiving?: number;
  batchNumber?: string;
  expiryDate?: Date;
}

// Financial management
export type TransactionType = 'income' | 'expense';
export type TransactionCategory = 'sales' | 'purchases' | 'administrative' | 'other';

export interface FinancialTransaction {
  id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  reference_id?: string; // Order ID or Purchase Order ID
  reference_type?: string; // 'order' | 'purchase_order' | 'manual'
  date: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Notification system
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  action_url?: string;
  created_at: string;
  updated_at: string;
}

// Settings and configuration
export interface SystemSettings {
  id: string;
  key: string;
  value: string;
  description?: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  updated_at: string;
}

// Stock alerts
export interface StockAlert {
  id: string;
  product_id: string;
  product_name: string;
  current_stock: number;
  minimum_stock: number;
  expiry_date?: string;
  alert_type: 'low_stock' | 'expired' | 'near_expiry';
  resolved: boolean;
  created_at: string;
}

// Analytics and reporting
export interface SalesReport {
  period: string;
  total_sales: number;
  total_orders: number;
  top_products: Array<{
    product_id: string;
    product_name: string;
    quantity_sold: number;
    revenue: number;
  }>;
  payment_methods: Array<{
    method: PaymentMethod;
    count: number;
    total: number;
  }>;
}

export interface InventoryReport {
  total_products: number;
  total_value: number;
  low_stock_items: number;
  expired_items: number;
  near_expiry_items: number;
  categories: Array<{
    category_id: string;
    category_name: string;
    product_count: number;
    total_value: number;
  }>;
}

// Multicaixa payment integration
export interface MulticaixaPayment {
  id: string;
  order_id: string;
  amount: number;
  currency: 'AOA';
  status: 'pending' | 'completed' | 'failed';
  reference: string;
  payment_url?: string;
  created_at: string;
  updated_at: string;
}

// WhatsApp/SMS integration
export interface CommunicationLog {
  id: string;
  recipient: string;
  type: 'sms' | 'whatsapp' | 'email';
  message: string;
  status: 'sent' | 'delivered' | 'failed';
  reference_id?: string;
  created_at: string;
}

// AI Assistant conversation
export interface AIConversation {
  id: string;
  user_id?: string;
  session_id: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  created_at: string;
  updated_at: string;
}

// Add UUID generator utility function
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, 
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
