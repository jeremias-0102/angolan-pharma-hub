
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Calendar,
  Package,
  Clock,
  ArrowRight,
  Eye,
  RefreshCw
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getOrdersByUserId } from '@/services/orderService';
import { Order } from '@/types/models';

const OrderHistory: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  
  useEffect(() => {
    const loadOrders = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const userOrders = await getOrdersByUserId(user.id);
        setOrders(userOrders);
      } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadOrders();
  }, [user?.id]);
  
  // Filtrar pedidos com base na aba ativa
  const filteredOrders = orders.filter(order => {
    if (activeTab === "all") return true;
    if (activeTab === "active") {
      return ["pending", "paid", "processing", "ready", "shipping"].includes(order.status);
    }
    if (activeTab === "completed") {
      return order.status === "delivered";
    }
    if (activeTab === "cancelled") {
      return order.status === "cancelled";
    }
    return true;
  });
  
  // Traduzir status para português
  const translateStatus = (status: string) => {
    const statusMap: Record<string, string> = {
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
  
  // Retornar a classe de cor para o status
  const getStatusColor = (status: string) => {
    const statusColorMap: Record<string, string> = {
      pending: "bg-amber-100 text-amber-800 border-amber-200",
      paid: "bg-blue-100 text-blue-800 border-blue-200",
      processing: "bg-purple-100 text-purple-800 border-purple-200",
      ready: "bg-cyan-100 text-cyan-800 border-cyan-200",
      shipping: "bg-indigo-100 text-indigo-800 border-indigo-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200"
    };
    return statusColorMap[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };
  
  // Formatar data
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };
  
  // Formatar preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  const handleRefreshOrders = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const userOrders = await getOrdersByUserId(user.id);
      setOrders(userOrders);
    } catch (error) {
      console.error("Erro ao atualizar pedidos:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <MainLayout>
      <div className="container-responsive py-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Meus Pedidos</h1>
            <p className="text-gray-600">
              Visualize e acompanhe todos os seus pedidos
            </p>
          </div>
          <Button 
            variant="outline" 
            className="mt-4 md:mt-0"
            onClick={handleRefreshOrders}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar pedidos
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="active">Ativos</TabsTrigger>
            <TabsTrigger value="completed">Entregues</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {loading ? (
              // Loading skeleton
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-6 w-1/4" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <div className="flex gap-4">
                          <Skeleton className="h-16 w-16" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-2/3 mb-2" />
                            <Skeleton className="h-4 w-1/2" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className="flex w-full justify-between">
                        <Skeleton className="h-9 w-1/4" />
                        <Skeleton className="h-9 w-1/4" />
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div>
                          <CardTitle className="text-lg">
                            Pedido #{order.id}
                          </CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <Calendar className="h-3.5 w-3.5 mr-1 text-gray-500" />
                            {formatDate(order.created_at)}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className={getStatusColor(order.status)}>
                          {translateStatus(order.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Itens do pedido</h4>
                          <div className="space-y-3">
                            {order.items.slice(0, 3).map((item) => (
                              <div key={item.id} className="flex items-center">
                                <div className="h-12 w-12 rounded border overflow-hidden mr-3">
                                  <img 
                                    src={item.product_image || "/placeholder.svg"}
                                    alt={item.product_name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{item.product_name}</p>
                                  <p className="text-xs text-gray-500">
                                    {item.quantity} x {formatPrice(item.unit_price)}
                                  </p>
                                </div>
                                <p className="text-sm font-semibold">
                                  {formatPrice(item.quantity * item.unit_price)}
                                </p>
                              </div>
                            ))}
                            {order.items.length > 3 && (
                              <p className="text-xs text-gray-500 italic">
                                + {order.items.length - 3} mais itens
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Método de pagamento</h4>
                            <p className="text-sm">{order.payment_method}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Total do pedido</h4>
                            <p className="text-base font-bold text-pharma-primary">{formatPrice(order.total)}</p>
                          </div>
                        </div>
                        
                        {order.delivery && (
                          <>
                            <Separator />
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Status da entrega</h4>
                              <div className="flex items-center mt-2">
                                <Package className="h-4 w-4 mr-2 text-pharma-primary" />
                                <p className="text-sm">
                                  {order.delivery.status === "delivered" ? (
                                    <span className="text-green-700">Entregue em {formatDate(order.delivery.actual_delivery || '')}</span>
                                  ) : order.delivery.estimated_delivery ? (
                                    <span className="flex items-center">
                                      <Clock className="h-3.5 w-3.5 mr-1 text-amber-500" />
                                      Previsão de entrega: {formatDate(order.delivery.estimated_delivery)}
                                    </span>
                                  ) : (
                                    <span>Em processamento</span>
                                  )}
                                </p>
                              </div>
                              
                              <p className="text-xs text-gray-500 mt-2">
                                {order.delivery.address}, {order.delivery.district}, {order.delivery.city}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between pt-3 border-t">
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver detalhes
                      </Button>
                      {["delivered", "shipping"].includes(order.status) && (
                        <Button size="sm" variant="outline">
                          Comprar novamente
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-gray-50 border border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Package className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="font-medium text-lg mb-2">Sem pedidos{activeTab !== "all" ? " nesta categoria" : ""}</h3>
                  <p className="text-gray-500 text-center mb-6">
                    {activeTab === "all" 
                      ? "Você ainda não fez nenhum pedido." 
                      : `Você não tem pedidos ${activeTab === "active" ? "ativos" : activeTab === "completed" ? "entregues" : "cancelados"}.`}
                  </p>
                  <Button onClick={() => navigate("/produtos")}>Ver produtos disponíveis</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default OrderHistory;
