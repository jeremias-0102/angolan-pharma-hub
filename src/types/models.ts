
export type UserRole = 'admin' | 'pharmacist' | 'delivery_person' | 'client' | 'supervisor';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'ready' | 'shipping' | 'delivered' | 'cancelled';

export type PurchaseOrderStatus = 'pending' | 'ordered' | 'received' | 'cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  password?: string;
  address?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  parent_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  tax_id: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  price_cost: number;
  price_sale: number;
  price_compare?: number;
  category_id: string;
  category?: string;
  supplier_id: string;
  manufacturer: string;
  requiresPrescription: boolean;
  image?: string;
  stock: number;
  batches?: Batch[];
  details?: string;
  active_ingredient?: string;
  form?: string;
  dosage?: string;
  usage_instructions?: string;
  general_info?: string;
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

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total: number;
  discount: number;
  status: OrderStatus;
  shipping_address: string;
  shipping_details?: any;
  payment_method: string;
  payment_status: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  requires_prescription: boolean;
  notes?: string;
  delivery?: {
    status: 'pending' | 'assigned' | 'in_progress' | 'delivered' | 'failed';
    address: string;
    district: string;
    city: string;
    postal_code?: string;
    estimated_delivery?: string;
    actual_delivery?: string;
    notes?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface PurchaseOrderItem {
  id: string;
  purchase_order_id: string;
  product_id: string;
  product_name: string;
  quantity_ordered: number;
  quantity_received?: number;
  unit_cost: number;
  total_cost: number;
  unit_price?: number;
  total?: number;
}

export interface PurchaseOrder {
  id: string;
  supplier_id: string;
  supplier_name: string;
  items: PurchaseOrderItem[];
  total: number;
  status: PurchaseOrderStatus;
  order_date: string;
  expected_delivery: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ReceivableItem extends PurchaseOrderItem {
  currentReceiving?: number;
  batchNumber?: string;
  expiryDate?: Date;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
  updated_at: string;
}

export interface StockAlert {
  id: string;
  product_id: string;
  product_name: string;
  alert_type: 'low_stock' | 'expired' | 'near_expiry';
  current_stock?: number;
  threshold?: number;
  expiry_date?: string;
  resolved: boolean;
  created_at: string;
}

export interface CompanySettings {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  tax_number?: string;
  registration_number?: string;
  currency: string;
  timezone: string;
  updated_at: string;
}

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  requiresPrescription: boolean;
  description?: string;
  price_sale?: number;
  needsPrescription?: boolean;
  stock?: number;
}

export interface Prescription {
  id: string;
  order_id: string;
  file_url: string;
  verified: boolean;
  created_at: string;
  upload_date?: string;
  validated?: boolean;
  validated_by?: string;
  validation_date?: string;
  updated_at?: string;
}

export interface FinancialTransaction {
  id: string;
  type: 'sale' | 'purchase' | 'expense' | 'income';
  amount: number;
  description: string;
  created_at: string;
  date?: string;
  updated_at?: string;
  category?: string;
}

export interface SystemSettings {
  id: string;
  key: string;
  value: string;
  updated_at: string;
}

export interface MulticaixaPayment {
  id: string;
  order_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  transaction_id?: string;
  created_at: string;
}

export interface CommunicationLog {
  id: string;
  type: 'email' | 'sms' | 'call';
  recipient: string;
  message: string;
  status: 'sent' | 'delivered' | 'failed';
  created_at: string;
}

export interface AIConversation {
  id: string;
  user_id: string;
  messages: any[];
  created_at: string;
  updated_at: string;
}

export interface Delivery {
  id: string;
  order_id: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'delivered' | 'failed';
  address: string;
  district: string;
  city: string;
  postal_code?: string;
  delivery_date?: string;
  estimated_delivery?: string;
  actual_delivery?: string;
  notes?: string;
  fee?: number;
  assigned_to?: string;
}

export interface SalesReport {
  id: string;
  period: string;
  total_sales: number;
  total_orders: number;
  created_at: string;
}

export interface InventoryReport {
  id: string;
  product_id: string;
  product_name: string;
  current_stock: number;
  minimum_stock: number;
  created_at: string;
}
