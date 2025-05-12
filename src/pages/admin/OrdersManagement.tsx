
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MoreHorizontal, 
  Eye, 
  Truck,
  CheckCircle, 
  XCircle,
  Calendar,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Order, OrderStatus } from "@/types/models";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import OrderDetailModal from "@/components/admin/OrderDetailModal";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

// Mock data - would be replaced with API calls in production
const mockOrders: Order[] = [
  {
    id: "ORD-001",
    user_id: "1",
    status: "pending",
    total: 3500,
    discount: 0,
    payment_method: "PIX",
    notes: "Entregar na recepção",
    created_at: "2023-05-10T09:30:00Z",
    updated_at: "2023-05-10T09:30:00Z",
    items: [
      {
        id: "ITEM-001",
        order_id: "ORD-001",
        product_id: "1",
        batch_id: "101",
        product_name: "Paracetamol 500mg",
        quantity: 2,
        unit_price: 350,
        total: 700
      },
      {
        id: "ITEM-002",
        order_id: "ORD-001",
        product_id: "2",
        batch_id: "102",
        product_name: "Amoxicilina 500mg",
        quantity: 1,
        unit_price: 650,
        total: 650
      }
    ],
    delivery: {
      id: "DEL-001",
      order_id: "ORD-001",
      status: "pending",
      address: "Rua Exemplo, 123",
      city: "Luanda",
      district: "Talatona",
      postal_code: "1000-001",
      estimated_delivery: "2023-05-11T14:00:00Z",
      notes: "Ligar antes de entregar",
      created_at: "2023-05-10T09:30:00Z",
      updated_at: "2023-05-10T09:30:00Z"
    }
  },
  {
    id: "ORD-002",
    user_id: "2",
    status: "paid",
    total: 4200,
    discount: 200,
    payment_method: "Cartão de Crédito",
    created_at: "2023-05-11T14:20:00Z",
    updated_at: "2023-05-11T14:20:00Z",
    items: [
      {
        id: "ITEM-003",
        order_id: "ORD-002",
        product_id: "3",
        batch_id: "103",
        product_name: "Ibuprofeno 400mg",
        quantity: 3,
        unit_price: 420,
        total: 1260
      }
    ],
    delivery: {
      id: "DEL-002",
      order_id: "ORD-002",
      status: "pending",
      address: "Av Principal, 456",
      city: "Luanda",
      district: "Miramar",
      created_at: "2023-05-11T14:20:00Z",
      updated_at: "2023-05-11T14:20:00Z"
    }
  },
  {
    id: "ORD-003",
    user_id: "3",
    status: "delivered",
    total: 7500,
    discount: 500,
    payment_method: "Transferência Bancária",
    created_at: "2023-05-09T11:15:00Z",
    updated_at: "2023-05-10T16:40:00Z",
    items: [
      {
        id: "ITEM-004",
        order_id: "ORD-003",
        product_id: "1",
        batch_id: "101",
        product_name: "Paracetamol 500mg",
        quantity: 5,
        unit_price: 350,
        total: 1750
      }
    ],
    delivery: {
      id: "DEL-003",
      order_id: "ORD-003",
      delivery_person_id: "3",
      status: "delivered",
      address: "Rua Secundária, 789",
      city: "Luanda",
      district: "Maianga",
      estimated_delivery: "2023-05-10T14:00:00Z",
      actual_delivery: "2023-05-10T16:30:00Z",
      created_at: "2023-05-09T11:15:00Z",
      updated_at: "2023-05-10T16:40:00Z"
    }
  },
  {
    id: "ORD-004",
    user_id: "4",
    status: "cancelled",
    total: 5000,
    discount: 0,
    payment_method: "PIX",
    notes: "Cliente cancelou o pedido",
    created_at: "2023-05-08T16:25:00Z",
    updated_at: "2023-05-08T17:30:00Z",
    items: [
      {
        id: "ITEM-005",
        order_id: "ORD-004",
        product_id: "2",
        batch_id: "102",
        product_name: "Amoxicilina 500mg",
        quantity: 2,
        unit_price: 650,
        total: 1300
      }
    ],
    delivery: {
      id: "DEL-004",
      order_id: "ORD-004",
      status: "failed",
      address: "Rua do Comércio, 321",
      city: "Luanda",
      district: "Ingombota",
      created_at: "2023-05-08T16:25:00Z",
      updated_at: "2023-05-08T17:30:00Z"
    }
  }
];

const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      order.delivery?.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.product_name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const viewOrderDetails = (order: Order) => {
    setCurrentOrder(order);
    setIsDetailModalOpen(true);
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus, updated_at: new Date().toISOString() }
          : order
      )
    );

    toast({
      title: "Status atualizado",
      description: `O pedido ${orderId} foi atualizado para ${translateStatus(newStatus)}.`,
    });
  };

  const handleBack = () => {
    navigate('/admin');
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  // Translate order status to Portuguese
  const translateStatus = (status: OrderStatus): string => {
    const statusMap: Record<OrderStatus, string> = {
      pending: "Pendente",
      paid: "Pago",
      processing: "Em processamento",
      ready: "Pronto para entrega",
      shipping: "Em transporte",
      delivered: "Entregue",
      cancelled: "Cancelado"
    };
    return statusMap[status] || status;
  };

  // Get badge variant based on order status
  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "paid":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "ready":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "shipping":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get next available status options based on current status
  const getNextStatusOptions = (currentStatus: OrderStatus): OrderStatus[] => {
    switch (currentStatus) {
      case "pending":
        return ["paid", "cancelled"];
      case "paid":
        return ["processing", "cancelled"];
      case "processing":
        return ["ready", "cancelled"];
      case "ready":
        return ["shipping", "cancelled"];
      case "shipping":
        return ["delivered", "cancelled"];
      case "delivered":
      case "cancelled":
        return [];
      default:
        return [];
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-5 w-5 mr-1" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Gestão de Pedidos</h1>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Buscar pedidos por ID, endereço, produtos..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          
          <div className="w-full sm:w-48">
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="processing">Em processamento</SelectItem>
                <SelectItem value="ready">Pronto para entrega</SelectItem>
                <SelectItem value="shipping">Em transporte</SelectItem>
                <SelectItem value="delivered">Entregue</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID do Pedido</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1 text-gray-500" />
                        {formatDate(order.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(order.total)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadgeVariant(order.status)}>
                        {translateStatus(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.payment_method}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {order.delivery?.address}, {order.delivery?.district}, {order.delivery?.city}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => viewOrderDetails(order)}>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Ver detalhes</span>
                          </DropdownMenuItem>
                          
                          {getNextStatusOptions(order.status).includes("delivered") && (
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "delivered")}>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                              <span>Marcar como entregue</span>
                            </DropdownMenuItem>
                          )}
                          
                          {getNextStatusOptions(order.status).includes("shipping") && (
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "shipping")}>
                              <Truck className="mr-2 h-4 w-4 text-blue-600" />
                              <span>Iniciar entrega</span>
                            </DropdownMenuItem>
                          )}
                          
                          {getNextStatusOptions(order.status).includes("cancelled") && (
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "cancelled")}>
                              <XCircle className="mr-2 h-4 w-4 text-red-600" />
                              <span>Cancelar pedido</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Nenhum pedido encontrado. Tente outros termos de busca.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        order={currentOrder}
        onUpdateStatus={(newStatus) => {
          if (currentOrder) {
            updateOrderStatus(currentOrder.id, newStatus);
          }
        }}
      />
    </div>
  );
};

export default OrdersManagement;
