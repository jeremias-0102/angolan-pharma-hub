
// Add to the existing types file

export interface CartProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  price_sale: number; // Added this field
  image?: string;
  stock: number;
  needsPrescription: boolean;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
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
  discount: number; // Added this field
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string; // Added this field
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Delivery {
  id: string;
  order_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  address: string;
  delivery_date: string | null;
  notes: string;
  fee: number;
  assigned_to: string; // Added this field
}
