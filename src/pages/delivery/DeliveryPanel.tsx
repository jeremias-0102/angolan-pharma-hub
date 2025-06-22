import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Package, 
  CheckCircle2, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  FileText,
  Truck,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Order } from '@/types/models';
import { getAllOrders, updateOrderStatus } from '@/services/orderService';
import { generateClientInvoicePDF } from '@/utils/reportExport';
import { useToast } from '@/hooks/use-toast';

const DeliveryPanel = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Mock data para demonstração - em produção seria carregado do banco
  const mockDeliveryOrders: Order[] = [
    {
      id: 'ORD-2025-001',
      user_id: 'user1',
      status: 'shipping',
      payment_method: 'multicaixa',
      payment_status: 'paid',
      total: 15000,
      customer_name: 'João Silva',
      customer_email: 'joao@email.com',
      customer_phone: '+244 923 456 789',
      shipping_address: 'Rua dos Remédios, 123, Bairro Miramar, Luanda',
      items: [
        {
          id: 'item1',
          order_id: 'ORD-2025-001',
          product_id: 'prod1',
          product_name: 'Paracetamol 500mg',
          product_image: '',
          quantity: 2,
          unit_price: 2500,
          total: 5000
        },
        {
          id: 'item2',
          order_id: 'ORD-2025-001',
          product_id: 'prod2',
          product_name: 'Amoxicilina 250mg',
          product_image: '',
          quantity: 1,
          unit_price: 10000,
          total: 10000
        }
      ],
      requires_prescription: false,
      discount: 0,
      created_at: '2025-01-15T10:00:00Z',
      updated_at: '2025-01-15T14:30:00Z',
      delivery: {
        status: 'in_progress',
        address: 'Rua dos Remédios, 123, Bairro Miramar, Luanda',
        district: 'Miramar',
        city: 'Luanda',
        postal_code: '1000',
        estimated_delivery: '2025-01-15T16:00:00Z',
        notes: 'Entregar no portão principal'
      }
    },
    {
      id: 'ORD-2025-002',
      user_id: 'user2',
      status: 'ready',
      payment_method: 'cash_on_delivery',
      payment_status: 'pending',
      total: 8500,
      customer_name: 'Maria Santos',
      customer_email: 'maria@email.com',
      customer_phone: '+244 924 567 890',
      shipping_address: 'Avenida Marginal, 456, Bairro Ingombota, Luanda',
      items: [
        {
          id: 'item3',
          order_id: 'ORD-2025-002',
          product_id: 'prod3',
          product_name: 'Vitamina C 1g',
          product_image: '',
          quantity: 1,
          unit_price: 8500,
          total: 8500
        }
      ],
      requires_prescription: false,
      discount: 0,
      created_at: '2025-01-15T11:00:00Z',
      updated_at: '2025-01-15T11:00:00Z',
      delivery: {
        status: 'assigned',
        address: 'Avenida Marginal, 456, Bairro Ingombota, Luanda',
        district: 'Ingombota',
        city: 'Luanda',
        postal_code: '1001',
        estimated_delivery: '2025-01-15T17:00:00Z',
        notes: 'Apartamento 2B'
      }
    }
  ];

  useEffect(() => {
    // Simular carregamento de dados
    setOrders(mockDeliveryOrders);
    setIsLoading(false);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-blue-500">Pronto para Entrega</Badge>;
      case 'shipping':
        return <Badge className="bg-orange-500">Em Transporte</Badge>;
      case 'delivered':
        return <Badge className="bg-green-500">Entregue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleStartDelivery = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, 'shipping');
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'shipping' as const, updated_at: new Date().toISOString() }
          : order
      ));
      toast({
        title: "Entrega iniciada",
        description: `Entrega do pedido ${orderId} foi iniciada.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível iniciar a entrega.",
      });
    }
  };

  const handleCompleteDelivery = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, 'delivered');
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status: 'delivered' as const, 
              updated_at: new Date().toISOString(),
              delivery: order.delivery ? {
                ...order.delivery,
                status: 'delivered',
                actual_delivery: new Date().toISOString()
              } : undefined
            }
          : order
      ));
      toast({
        title: "Entrega finalizada",
        description: `Pedido ${orderId} foi marcado como entregue.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível finalizar a entrega.",
      });
    }
  };

  const handleGenerateInvoice = async (order: Order) => {
    try {
      await generateClientInvoicePDF(order);
      toast({
        title: "Fatura gerada",
        description: "A fatura foi baixada em PDF.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível gerar a fatura.",
      });
    }
  };

  const pendingOrders = orders.filter(order => order.status === 'ready');
  const inTransitOrders = orders.filter(order => order.status === 'shipping');
  const deliveredOrders = orders.filter(order => order.status === 'delivered');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Painel do Entregador</h1>
        <p className="text-gray-600">Bem-vindo, {user?.name}</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Entregas Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">{pendingOrders.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Em Transporte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-orange-500 mr-2" />
              <span className="text-2xl font-bold">{inTransitOrders.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Entregas Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle2 className="h-8 w-8 text-green-500 mr-2" />
              <span className="text-2xl font-bold">{deliveredOrders.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Tabs */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pendentes ({pendingOrders.length})</TabsTrigger>
          <TabsTrigger value="in-transit">Em Transporte ({inTransitOrders.length})</TabsTrigger>
          <TabsTrigger value="delivered">Entregues ({deliveredOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="grid gap-4">
            {pendingOrders.map((order) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onStartDelivery={handleStartDelivery}
                onCompleteDelivery={handleCompleteDelivery}
                onGenerateInvoice={handleGenerateInvoice}
              />
            ))}
            {pendingOrders.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  Nenhuma entrega pendente
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="in-transit">
          <div className="grid gap-4">
            {inTransitOrders.map((order) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onStartDelivery={handleStartDelivery}
                onCompleteDelivery={handleCompleteDelivery}
                onGenerateInvoice={handleGenerateInvoice}
              />
            ))}
            {inTransitOrders.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  Nenhuma entrega em transporte
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="delivered">
          <div className="grid gap-4">
            {deliveredOrders.map((order) => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onStartDelivery={handleStartDelivery}
                onCompleteDelivery={handleCompleteDelivery}
                onGenerateInvoice={handleGenerateInvoice}
              />
            ))}
            {deliveredOrders.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center text-gray-500">
                  Nenhuma entrega concluída
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface OrderCardProps {
  order: Order;
  onStartDelivery: (orderId: string) => void;
  onCompleteDelivery: (orderId: string) => void;
  onGenerateInvoice: (order: Order) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ 
  order, 
  onStartDelivery, 
  onCompleteDelivery, 
  onGenerateInvoice 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-blue-500">Pronto para Entrega</Badge>;
      case 'shipping':
        return <Badge className="bg-orange-500">Em Transporte</Badge>;
      case 'delivered':
        return <Badge className="bg-green-500">Entregue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Pedido {order.id}</CardTitle>
            <p className="text-sm text-gray-600">
              {new Date(order.created_at).toLocaleString('pt-AO')}
            </p>
          </div>
          {getStatusBadge(order.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Customer Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium">{order.customer_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{order.customer_phone}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
              <span className="text-sm">{order.shipping_address}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Total: </span>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(order.total)}
              </span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Pagamento: </span>
              <span>{order.payment_method}</span>
            </div>
            {order.delivery?.notes && (
              <div className="text-sm">
                <span className="font-medium">Observações: </span>
                <span className="italic">{order.delivery.notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* Items */}
        <div>
          <h4 className="font-medium mb-2">Itens do Pedido:</h4>
          <div className="space-y-1">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.product_name}</span>
                <span>{formatCurrency(item.total)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onGenerateInvoice(order)}
          >
            <FileText className="h-4 w-4 mr-1" />
            Gerar Fatura
          </Button>
          
          {order.status === 'ready' && (
            <Button
              size="sm"
              onClick={() => onStartDelivery(order.id)}
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Truck className="h-4 w-4 mr-1" />
              Iniciar Entrega
            </Button>
          )}
          
          {order.status === 'shipping' && (
            <Button
              size="sm"
              onClick={() => onCompleteDelivery(order.id)}
              className="bg-green-500 hover:bg-green-600"
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Finalizar Entrega
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryPanel;
