
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
import { Search, MoreHorizontal, Eye, Edit2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Order, OrderStatus } from "@/types/models";
import OrderDetailModal from '@/components/admin/OrderDetailModal';

const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const { toast } = useToast();

  // Mock data para desenvolvimento
  const mockOrders: Order[] = [
    {
      id: "ORD-001",
      user_id: "user1",
      status: "pending",
      payment_method: "multicaixa",
      payment_status: "pending",
      total: 15000,
      items: [
        {
          id: "item1",
          order_id: "ORD-001",
          product_id: "prod1",
          product_name: "Paracetamol 500mg",
          product_image: "",
          quantity: 2,
          unit_price: 2500,
          total: 5000
        },
        {
          id: "item2",
          order_id: "ORD-001",
          product_id: "prod2",
          product_name: "Amoxicilina 250mg",
          product_image: "",
          quantity: 1,
          unit_price: 10000,
          total: 10000
        }
      ],
      shipping_address: "Rua dos Remedios, 123, Luanda",
      shipping_details: {},
      customer_name: "João Silva",
      customer_email: "joao@email.com",
      customer_phone: "+244 923 456 789",
      requires_prescription: false,
      discount: 0,
      created_at: "2024-12-08T10:00:00Z",
      updated_at: "2024-12-08T10:00:00Z"
    },
    {
      id: "ORD-002",
      user_id: "user2",
      status: "confirmed",
      payment_method: "cash_on_delivery",
      payment_status: "pending",
      total: 8500,
      items: [
        {
          id: "item3",
          order_id: "ORD-002",
          product_id: "prod3",
          product_name: "Vitamina C 1g",
          product_image: "",
          quantity: 1,
          unit_price: 8500,
          total: 8500
        }
      ],
      shipping_address: "Avenida Marginal, 456, Luanda",
      shipping_details: {},
      customer_name: "Maria Santos",
      customer_email: "maria@email.com",
      customer_phone: "+244 924 567 890",
      requires_prescription: false,
      discount: 0,
      created_at: "2024-12-08T11:00:00Z",
      updated_at: "2024-12-08T11:00:00Z"
    }
  ];

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setOrders(mockOrders);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading orders:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar pedidos",
          description: "Não foi possível carregar a lista de pedidos.",
        });
        setIsLoading(false);
      }
    };
    
    loadOrders();
  }, [toast]);

  const filteredOrders = orders.filter((order) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      order.id.toLowerCase().includes(searchLower) ||
      order.customer_name.toLowerCase().includes(searchLower) ||
      order.customer_email.toLowerCase().includes(searchLower) ||
      order.customer_phone.toLowerCase().includes(searchLower)
    );
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const openDetailModal = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleUpdateOrderStatus = async (newStatus: OrderStatus) => {
    if (selectedOrder) {
      try {
        const updatedOrder = { ...selectedOrder, status: newStatus, updated_at: new Date().toISOString() };
        setOrders((prevOrders) =>
          prevOrders.map((order) => (order.id === selectedOrder.id ? updatedOrder : order))
        );
        setSelectedOrder(updatedOrder);
        toast({
          title: "Status atualizado",
          description: `Pedido ${selectedOrder.id} foi atualizado para ${translateStatus(newStatus)}.`,
        });
      } catch (error) {
        console.error('Error updating order status:', error);
        toast({
          variant: "destructive",
          title: "Erro ao atualizar status",
          description: "Ocorreu um erro ao atualizar o status do pedido.",
        });
      }
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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Buscar pedidos por ID, cliente, email, telefone..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-pharma-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Carregando pedidos...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID do Pedido</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customer_name}</p>
                          <p className="text-sm text-gray-500">{order.customer_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleDateString('pt-AO')}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusBadgeVariant(order.status)}>
                          {translateStatus(order.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(order.total)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openDetailModal(order)}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Ver Detalhes</span>
                            </DropdownMenuItem>
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
        )}
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateOrderStatus}
      />
    </div>
  );
};

export default OrdersManagement;
