import { Product as CartProduct } from '@/types/models';

// Mock products with proper type
export const mockProducts: CartProduct[] = [
  {
    id: '1',
    code: 'PARA500',
    name: 'Paracetamol 500mg',
    description: 'Analgésico e antipirético para alívio de dores e febre.',
    price_cost: 800,
    price_sale: 1200,
    category: 'medicamentos',
    manufacturer: 'Pharma Labs',
    requiresPrescription: false,
    image: '/placeholder.svg',
    created_at: '2025-01-15T10:30:00Z',
    updated_at: '2025-01-15T10:30:00Z',
  },
  {
    id: '2',
    code: 'IBU400',
    name: 'Ibuprofeno 400mg',
    description: 'Anti-inflamatório não esteroidal para alívio de dores e inflamações.',
    price_cost: 1000,
    price_sale: 1500,
    category: 'medicamentos',
    manufacturer: 'Pharma Labs',
    requiresPrescription: false,
    image: '/placeholder.svg',
    created_at: '2025-01-15T10:30:00Z',
    updated_at: '2025-01-15T10:30:00Z',
  },
  {
    id: '3',
    code: 'VIT1000',
    name: 'Vitamina C 1000mg',
    description: 'Suplemento de vitamina C para fortalecimento do sistema imunológico.',
    price_cost: 1800,
    price_sale: 2500,
    category: 'vitaminas',
    manufacturer: 'Pharma Labs',
    requiresPrescription: false,
    image: '/placeholder.svg',
    created_at: '2025-01-15T10:30:00Z',
    updated_at: '2025-01-15T10:30:00Z',
  },
  {
    id: '4',
    code: 'AMO500',
    name: 'Amoxicilina 500mg',
    description: 'Antibiótico para tratamento de infecções bacterianas.',
    price_cost: 1000,
    price_sale: 3000,
    category: 'medicamentos',
    manufacturer: 'Pharma Labs',
    requiresPrescription: true,
    image: '/placeholder.svg',
    created_at: '2025-01-15T10:30:00Z',
    updated_at: '2025-01-15T10:30:00Z',
  },
  {
    id: '5',
    code: 'OME20',
    name: 'Omeprazol 20mg',
    description: 'Medicamento para redução da acidez gástrica.',
    price_cost: 1200,
    price_sale: 1800,
    category: 'medicamentos',
    manufacturer: 'Pharma Labs',
    requiresPrescription: false,
    image: '/placeholder.svg',
    created_at: '2025-01-15T10:30:00Z',
    updated_at: '2025-01-15T10:30:00Z',
  },
  {
    id: '6',
    code: 'DIP500',
    name: 'Dipirona 500mg',
    description: 'Analgésico e antipirético para alívio de dores e febre.',
    price_cost: 1000,
    price_sale: 1000,
    category: 'medicamentos',
    manufacturer: 'Pharma Labs',
    requiresPrescription: false,
    image: '/placeholder.svg',
    created_at: '2025-01-15T10:30:00Z',
    updated_at: '2025-01-15T10:30:00Z',
  },
  {
    id: '7',
    code: 'COMPLEXB',
    name: 'Complexo B',
    description: 'Suplemento de vitaminas do complexo B para o sistema nervoso e energia.',
    price_cost: 1200,
    price_sale: 2200,
    category: 'vitaminas',
    manufacturer: 'Pharma Labs',
    requiresPrescription: false,
    image: '/placeholder.svg',
    created_at: '2025-01-15T10:30:00Z',
    updated_at: '2025-01-15T10:30:00Z',
  },
  {
    id: '8',
    code: 'LOR10',
    name: 'Loratadina 10mg',
    description: 'Anti-histamínico para alívio de sintomas alérgicos.',
    price_cost: 1000,
    price_sale: 1600,
    category: 'medicamentos',
    manufacturer: 'Pharma Labs',
    requiresPrescription: false,
    image: '/placeholder.svg',
    created_at: '2025-01-15T10:30:00Z',
    updated_at: '2025-01-15T10:30:00Z',
  },
  {
    id: '9',
    code: 'SABON',
    name: 'Sabonete Antisséptico',
    description: 'Sabonete para higiene pessoal com propriedades antissépticas.',
    price_cost: 800,
    price_sale: 800,
    category: 'higieneepessoal',
    manufacturer: 'Pharma Labs',
    requiresPrescription: false,
    image: '/placeholder.svg',
    created_at: '2025-01-15T10:30:00Z',
    updated_at: '2025-01-15T10:30:00Z',
  },
  {
    id: '10',
    code: 'PROT50',
    name: 'Protetor Solar FPS 50',
    description: 'Protetor solar de amplo espectro para proteção contra raios UVA e UVB.',
    price_cost: 3000,
    price_sale: 3500,
    category: 'beleza',
    manufacturer: 'Pharma Labs',
    requiresPrescription: false,
    image: '/placeholder.svg',
    created_at: '2025-01-15T10:30:00Z',
    updated_at: '2025-01-15T10:30:00Z',
  },
];

// Mock orders
export interface OrderItem {
  id: number;
  product: CartProduct;
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
