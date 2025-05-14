
// Product related types
export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  price_cost: number;
  price_sale: number;
  price_compare?: number;
  category: string;
  manufacturer: string;
  requiresPrescription: boolean;
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
  quantity?: number; // Used when adding to cart
}

export interface Batch {
  id: string;
  product_id: string;
  batch_number: string;
  quantity: number;
  manufacture_date: string;
  expiry_date: string;
  created_at: string;
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
export type OrderStatus = "pending" | "paid" | "processing" | "ready" | "shipping" | "delivered" | "cancelled";

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed';
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
  address?: string; // Add address field to fix Profile.tsx error
  created_at: string;
  updated_at: string;
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
  batch_number?: string; // Added for acquisitionService.ts
  expiry_date?: string; // Added for acquisitionService.ts
}

export interface ReceivableItem extends PurchaseOrderItem {
  // Additional fields needed for ReceiveItemsModal
  currentReceiving?: number;
  batchNumber?: string;
  expiryDate?: Date;
}

// Add UUID generator utility function
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, 
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
