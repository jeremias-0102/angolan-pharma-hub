
// Types/interfaces para o sistema PharmaGest

// User roles
export type UserRole = 'admin' | 'pharmacist' | 'delivery' | 'client';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  address?: string;
  created_at: string;
  updated_at: string;
  password?: string; // Campo opcional para senha
}

// Product interface
export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  price_cost: number;
  price_sale: number;
  category: string;
  manufacturer: string;
  requiresPrescription: boolean;
  image?: string;
  created_at: string;
  updated_at: string;
  batches?: Batch[];
}

// Batch interface for product inventory
export interface Batch {
  id: string;
  product_id: string;
  batch_number: string;
  quantity: number;
  manufacture_date: string;
  expiry_date: string;
  created_at: string;
}

// Stock movement for tracking inventory changes
export interface StockMovement {
  id: string;
  batch_id: string;
  quantity: number; // positive for additions, negative for removals
  reason: 'purchase' | 'sale' | 'adjustment' | 'return' | 'expired';
  reference_id?: string; // order_id or purchase_id if applicable
  created_by: string; // user_id
  created_at: string;
}

// Order status
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'ready' | 'shipping' | 'delivered' | 'cancelled';

// Order interface
export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total: number;
  discount: number;
  payment_method: string;
  payment_id?: string; // ID from payment processor
  notes?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  delivery?: Delivery;
}

// Order item interface
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  batch_id?: string; // May be assigned during processing
  product_name: string; // Snapshot at time of order
  quantity: number;
  unit_price: number;
  total: number;
}

// Delivery status
export type DeliveryStatus = 'pending' | 'assigned' | 'in_progress' | 'delivered' | 'failed';

// Delivery interface
export interface Delivery {
  id: string;
  order_id: string;
  delivery_person_id?: string;
  status: DeliveryStatus;
  address: string;
  city: string;
  district: string;
  postal_code?: string;
  estimated_delivery?: string;
  actual_delivery?: string;
  start_location?: [number, number]; // latitude, longitude
  end_location?: [number, number]; // latitude, longitude
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Supplier interface
export interface Supplier {
  id: string;
  name: string;
  tax_id: string; // NIF/NIPC
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
}

// Purchase order for restocking
export interface PurchaseOrder {
  id: string;
  supplier_id: string;
  status: 'draft' | 'sent' | 'partial' | 'complete' | 'cancelled';
  total: number;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  items: PurchaseOrderItem[];
}

// Purchase order item
export interface PurchaseOrderItem {
  id: string;
  purchase_order_id: string;
  product_id: string;
  quantity_ordered: number;
  quantity_received: number;
  unit_price: number;
  batch_number?: string;
  expiry_date?: string;
}

// Sales summary for reporting
export interface SalesSummary {
  date: string;
  total_sales: number;
  total_orders: number;
  average_order_value: number;
  top_products: {
    product_id: string;
    product_name: string;
    quantity: number;
    total: number;
  }[];
}

// Stock alert configuration
export interface StockAlert {
  product_id: string;
  min_quantity: number;
  expiry_days_threshold: number; // Alert X days before expiration
  enabled: boolean;
}
