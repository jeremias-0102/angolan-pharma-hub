
export type UserRole = 'admin' | 'pharmacist' | 'delivery_person' | 'client' | 'supervisor';

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
}

export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
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
  category_id: string;
  supplier_id: string;
  manufacturer: string;
  requiresPrescription: boolean;
  image?: string;
  stock: number;
  batches?: Batch[];
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

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface PurchaseOrder {
  id: string;
  supplier_id: string;
  supplier_name: string;
  items: PurchaseOrderItem[];
  total_amount: number;
  status: 'pending' | 'ordered' | 'received' | 'cancelled';
  order_date: string;
  expected_delivery: string;
  notes?: string;
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
