
import { Product } from '@/contexts/CartContext';

// Mock products
export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Paracetamol 500mg',
    description: 'Analgésico e antipirético para alívio de dores e febre.',
    price: 1200,
    stock: 150,
    image: '/placeholder.svg',
    category: 'medicamentos',
    needsPrescription: false,
  },
  {
    id: 2,
    name: 'Ibuprofeno 400mg',
    description: 'Anti-inflamatório não esteroidal para alívio de dores e inflamações.',
    price: 1500,
    stock: 120,
    image: '/placeholder.svg',
    category: 'medicamentos',
    needsPrescription: false,
  },
  {
    id: 3,
    name: 'Vitamina C 1000mg',
    description: 'Suplemento de vitamina C para fortalecimento do sistema imunológico.',
    price: 2500,
    stock: 80,
    image: '/placeholder.svg',
    category: 'vitaminas',
    needsPrescription: false,
  },
  {
    id: 4,
    name: 'Amoxicilina 500mg',
    description: 'Antibiótico para tratamento de infecções bacterianas.',
    price: 3000,
    stock: 60,
    image: '/placeholder.svg',
    category: 'medicamentos',
    needsPrescription: true,
  },
  {
    id: 5,
    name: 'Omeprazol 20mg',
    description: 'Medicamento para redução da acidez gástrica.',
    price: 1800,
    stock: 100,
    image: '/placeholder.svg',
    category: 'medicamentos',
    needsPrescription: false,
  },
  {
    id: 6,
    name: 'Dipirona 500mg',
    description: 'Analgésico e antipirético para alívio de dores e febre.',
    price: 1000,
    stock: 200,
    image: '/placeholder.svg',
    category: 'medicamentos',
    needsPrescription: false,
  },
  {
    id: 7,
    name: 'Complexo B',
    description: 'Suplemento de vitaminas do complexo B para o sistema nervoso e energia.',
    price: 2200,
    stock: 75,
    image: '/placeholder.svg',
    category: 'vitaminas',
    needsPrescription: false,
  },
  {
    id: 8,
    name: 'Loratadina 10mg',
    description: 'Anti-histamínico para alívio de sintomas alérgicos.',
    price: 1600,
    stock: 90,
    image: '/placeholder.svg',
    category: 'medicamentos',
    needsPrescription: false,
  },
  {
    id: 9,
    name: 'Sabonete Antisséptico',
    description: 'Sabonete para higiene pessoal com propriedades antissépticas.',
    price: 800,
    stock: 120,
    image: '/placeholder.svg',
    category: 'higieneepessoal',
    needsPrescription: false,
  },
  {
    id: 10,
    name: 'Protetor Solar FPS 50',
    description: 'Protetor solar de amplo espectro para proteção contra raios UVA e UVB.',
    price: 3500,
    stock: 45,
    image: '/placeholder.svg',
    category: 'beleza',
    needsPrescription: false,
  },
];

// Mock orders
export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  userId: number;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  address: string;
  paymentMethod: string;
}

export const mockOrders: Order[] = [
  {
    id: 1,
    userId: 4, // client
    items: [
      { id: 1, product: mockProducts[0], quantity: 2, price: mockProducts[0].price },
      { id: 2, product: mockProducts[2], quantity: 1, price: mockProducts[2].price },
    ],
    totalAmount: mockProducts[0].price * 2 + mockProducts[2].price,
    status: 'delivered',
    createdAt: '2023-04-15T10:30:00Z',
    updatedAt: '2023-04-16T14:20:00Z',
    address: 'Rua dos Coqueiros, 123, Luanda',
    paymentMethod: 'card',
  },
  {
    id: 2,
    userId: 4, // client
    items: [
      { id: 3, product: mockProducts[5], quantity: 1, price: mockProducts[5].price },
    ],
    totalAmount: mockProducts[5].price,
    status: 'processing',
    createdAt: '2023-05-02T15:45:00Z',
    updatedAt: '2023-05-02T16:10:00Z',
    address: 'Avenida 4 de Fevereiro, 78, Luanda',
    paymentMethod: 'cash',
  },
  {
    id: 3,
    userId: 4, // client
    items: [
      { id: 4, product: mockProducts[3], quantity: 1, price: mockProducts[3].price },
      { id: 5, product: mockProducts[4], quantity: 3, price: mockProducts[4].price },
      { id: 6, product: mockProducts[8], quantity: 2, price: mockProducts[8].price },
    ],
    totalAmount: mockProducts[3].price + mockProducts[4].price * 3 + mockProducts[8].price * 2,
    status: 'pending',
    createdAt: '2023-05-10T09:20:00Z',
    updatedAt: '2023-05-10T09:20:00Z',
    address: 'Rua da Missão, 45, Luanda',
    paymentMethod: 'card',
  },
];

// Mock suppliers
export interface Supplier {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  nif: string;
}

export const mockSuppliers: Supplier[] = [
  {
    id: 1,
    name: 'Distribuidora Farmacêutica Angola',
    email: 'contato@disfarma.co.ao',
    phone: '+244 923 456 789',
    address: 'Zona Industrial de Viana, Luanda',
    nif: '54545556'
  },
  {
    id: 2,
    name: 'Importadora Medicinal Lda',
    email: 'vendas@impmedicinal.co.ao',
    phone: '+244 912 345 678',
    address: 'Avenida Comandante Kima Kienda, 76, Luanda',
    nif: '65478932'
  }
];

// Mock acquisition
export interface AcquisitionItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitCost: number;
}

export interface Acquisition {
  id: number;
  supplierId: number;
  supplierName: string;
  items: AcquisitionItem[];
  totalAmount: number;
  status: 'pending' | 'ordered' | 'received' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export const mockAcquisitions: Acquisition[] = [
  {
    id: 1,
    supplierId: 1,
    supplierName: 'Distribuidora Farmacêutica Angola',
    items: [
      { id: 1, productId: 1, productName: 'Paracetamol 500mg', quantity: 100, unitCost: 800 },
      { id: 2, productId: 2, productName: 'Ibuprofeno 400mg', quantity: 50, unitCost: 1000 },
    ],
    totalAmount: 800 * 100 + 1000 * 50,
    status: 'received',
    createdAt: '2023-03-10T08:00:00Z',
    updatedAt: '2023-03-15T10:30:00Z',
  },
  {
    id: 2,
    supplierId: 2,
    supplierName: 'Importadora Medicinal Lda',
    items: [
      { id: 3, productId: 3, productName: 'Vitamina C 1000mg', quantity: 30, unitCost: 1800 },
      { id: 4, productId: 7, productName: 'Complexo B', quantity: 25, unitCost: 1600 },
    ],
    totalAmount: 1800 * 30 + 1600 * 25,
    status: 'ordered',
    createdAt: '2023-04-22T14:15:00Z',
    updatedAt: '2023-04-22T15:30:00Z',
  }
];
