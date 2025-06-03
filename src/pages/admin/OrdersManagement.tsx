import React, { useState, useEffect } from 'react';
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
import { getAllOrders, updateOrderStatus } from '@/services/orderService';

const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch orders from database
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const fetchedOrders = await getAllOrders();
        setOrders(fetchedOrders);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os pedidos.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchOrders();
  }, [toast]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      order.delivery?.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? updatedOrder : order
        )
      );

      toast({
        title: "Status atualizado",
        description: `O pedido ${orderId} foi atualizado para ${translateStatus(newStatus)}.`,
      });
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do pedido.",
        variant: "destructive",
      });
    }
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
      confirmed: "Confirmado",
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
      case "confirmed":
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
        return ["confirmed", "cancelled"];
      case "confirmed":
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
                <SelectItem value="confirmed">Confirmado</SelectItem>
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
                <TableHead>Endereço</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                    <p className="mt-2 text-gray-500">Carregando pedidos...</p>
                  </TableCell>
                </TableRow>
              ) : filteredOrders.length > 0 ? (
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
                    <TableCell className="max-w-xs truncate">
                      {order.delivery?.address ? `${order.delivery.address}, ${order.delivery.district}, ${order.delivery.city}` : 'Sem endereço'}
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
                            <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, "delivered")}>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                              <span>Marcar como entregue</span>
                            </DropdownMenuItem>
                          )}
                          
                          {getNextStatusOptions(order.status).includes("shipping") && (
                            <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, "shipping")}>
                              <Truck className="mr-2 h-4 w-4 text-blue-600" />
                              <span>Iniciar entrega</span>
                            </DropdownMenuItem>
                          )}
                          
                          {getNextStatusOptions(order.status).includes("cancelled") && (
                            <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.id, "cancelled")}>
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
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
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
            handleUpdateOrderStatus(currentOrder.id, newStatus);
          }
        }}
      />
    </div>
  );
};

export default OrdersManagement;
