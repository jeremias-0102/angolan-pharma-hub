
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ArrowLeft,
  Check,
  MapPin,
  Calendar,
  Truck,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Order } from "@/types/models";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from '@/contexts/AuthContext';

const DeliveryOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // TODO: Substituir por chamada real para API quando disponível
  useEffect(() => {
    // Simulação de dados para demonstração
    setTimeout(() => {
      const mockOrders: Order[] = [
        {
          id: "PED0001",
          user_id: "USR123",
          status: "shipping",
          payment_method: "Multicaixa Express",
          total: 12500,
          items: [
            {
              id: "ITEM001",
              product_id: "PROD001",
              product_name: "Vitamina C 500mg",
              product_image: "/placeholder.svg",
              quantity: 2,
              unit_price: 3000,
              total: 6000
            },
            {
              id: "ITEM002",
              product_id: "PROD002",
              product_name: "Paracetamol 500mg",
              product_image: "/placeholder.svg",
              quantity: 1,
              unit_price: 2500,
              total: 2500
            }
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          delivery: {
            address: "Rua das Flores, 123",
            district: "Maianga",
            city: "Luanda",
            status: "in_progress",
            assigned_to: user?.id || "",
            estimated_delivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            notes: "Entregar na portaria"
          }
        },
        {
          id: "PED0002",
          user_id: "USR456",
          status: "ready",
          payment_method: "Cartão de Crédito",
          total: 8000,
          items: [
            {
              id: "ITEM003",
              product_id: "PROD003",
              product_name: "Ibuprofeno 400mg",
              product_image: "/placeholder.svg",
              quantity: 1,
              unit_price: 8000,
              total: 8000
            }
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          delivery: {
            address: "Av. Comandante Valódia, 45",
            district: "Sambizanga",
            city: "Luanda",
            status: "assigned",
            assigned_to: user?.id || "",
            estimated_delivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          }
        },
        {
          id: "PED0003",
          user_id: "USR789",
          status: "shipping",
          payment_method: "Pagamento na entrega",
          total: 15000,
          items: [
            {
              id: "ITEM004",
              product_id: "PROD004",
              product_name: "Complexo B",
              product_image: "/placeholder.svg",
              quantity: 1,
              unit_price: 15000,
              total: 15000
            }
          ],
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          delivery: {
            address: "Rua Amílcar Cabral, 88",
            district: "Ingombota",
            city: "Luanda",
            status: "in_progress",
            assigned_to: user?.id || "",
            estimated_delivery: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
          }
        },
        {
          id: "PED0004",
          user_id: "USR123",
          status: "delivered",
          payment_method: "Multicaixa Express",
          total: 7500,
          items: [
            {
              id: "ITEM005",
              product_id: "PROD005",
              product_name: "Loratadina 10mg",
              product_image: "/placeholder.svg",
              quantity: 3,
              unit_price: 2500,
              total: 7500
            }
          ],
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          delivery: {
            address: "Rua da Missão, 204",
            district: "Ingombota",
            city: "Luanda",
            status: "delivered",
            assigned_to: user?.id || "",
            estimated_delivery: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            actual_delivery: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        }
      ];
      
      setOrders(mockOrders);
      setLoading(false);
    }, 1500);
  }, [user?.id]);
  
  // Filtrar entregas com base na busca e filtro de status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      order.delivery?.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.product_name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'pending') {
      return matchesSearch && (order.delivery?.status === 'assigned' || order.delivery?.status === 'pending');
    }
    if (statusFilter === 'in_progress') {
      return matchesSearch && order.delivery?.status === 'in_progress';
    }
    if (statusFilter === 'delivered') {
      return matchesSearch && order.delivery?.status === 'delivered';
    }
    
    return matchesSearch;
  });
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleBack = () => {
    navigate('/entregador');
  };
  
  // Traduzir status da entrega para português
  const translateDeliveryStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "Pendente",
      assigned: "Atribuído",
      in_progress: "Em andamento",
      delivered: "Entregue",
      failed: "Falha na entrega"
    };
    return statusMap[status] || status;
  };
  
  // Obter classe CSS para o status da entrega
  const getDeliveryStatusClass = (status: string) => {
    const statusClassMap: Record<string, string> = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      assigned: "bg-blue-50 text-blue-700 border-blue-200",
      in_progress: "bg-indigo-50 text-indigo-700 border-indigo-200",
      delivered: "bg-green-50 text-green-700 border-green-200",
      failed: "bg-red-50 text-red-700 border-red-200"
    };
    return statusClassMap[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };
  
  // Formatar data
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };
  
  // Formatar moeda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  // Marcar entrega como concluída
  const markAsDelivered = (orderId: string) => {
    // TODO: Substituir por chamada real para API quando disponível
    try {
      // Atualizar estado local enquanto esperamos a API
      setOrders(prevOrders => 
        prevOrders.map(order => {
          if (order.id === orderId) {
            const now = new Date().toISOString();
            return {
              ...order,
              status: "delivered" as any,
              updated_at: now,
              delivery: {
                ...order.delivery!,
                status: "delivered",
                actual_delivery: now
              }
            };
          }
          return order;
        })
      );
      
      toast({
        title: "Entrega concluída",
        description: `Pedido ${orderId} marcado como entregue.`,
      });
    } catch (error) {
      console.error("Erro ao marcar como entregue:", error);
      toast({
        title: "Erro",
        description: "Não foi possível marcar a entrega como concluída.",
        variant: "destructive",
      });
    }
  };
  
  // Iniciar entrega
  const startDelivery = (orderId: string) => {
    // TODO: Substituir por chamada real para API quando disponível
    try {
      // Atualizar estado local enquanto esperamos a API
      setOrders(prevOrders => 
        prevOrders.map(order => {
          if (order.id === orderId) {
            return {
              ...order,
              status: "shipping" as any,
              updated_at: new Date().toISOString(),
              delivery: {
                ...order.delivery!,
                status: "in_progress"
              }
            };
          }
          return order;
        })
      );
      
      toast({
        title: "Entrega iniciada",
        description: `Pedido ${orderId} em processo de entrega.`,
      });
    } catch (error) {
      console.error("Erro ao iniciar entrega:", error);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar a entrega.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="outline" onClick={handleBack} className="mr-4">
            <ArrowLeft className="h-5 w-5 mr-1" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Gestão de Entregas</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center text-amber-600">
                <AlertCircle className="h-4 w-4 mr-2" />
                Pendentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {orders.filter(o => o.delivery?.status === 'assigned' || o.delivery?.status === 'pending').length}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center text-blue-600">
                <Truck className="h-4 w-4 mr-2" />
                Em andamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {orders.filter(o => o.delivery?.status === 'in_progress').length}
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center text-green-600">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Entregas realizadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {orders.filter(o => o.delivery?.status === 'delivered').length}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Buscar por ID, endereço ou produtos..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
            
            <div className="w-full md:w-72">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="in_progress">Em andamento</SelectItem>
                  <SelectItem value="delivered">Entregues</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pharma-primary mx-auto"></div>
              <p className="mt-4 text-gray-500">Carregando entregas...</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID do Pedido</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead>Data do Pedido</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0 text-gray-500" />
                          <span className="text-sm">
                            {order.delivery?.address}, {order.delivery?.district}, {order.delivery?.city}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-sm">{formatDate(order.created_at)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(order.total)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getDeliveryStatusClass(order.delivery?.status || 'pending')}>
                          {translateDeliveryStatus(order.delivery?.status || 'pending')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {order.delivery?.status === 'assigned' && (
                          <Button size="sm" onClick={() => startDelivery(order.id)}>
                            <Truck className="h-4 w-4 mr-1" />
                            Iniciar Entrega
                          </Button>
                        )}
                        
                        {order.delivery?.status === 'in_progress' && (
                          <Button size="sm" variant="default" onClick={() => markAsDelivered(order.id)}>
                            <Check className="h-4 w-4 mr-1" />
                            Marcar como Entregue
                          </Button>
                        )}
                        
                        {order.delivery?.status === 'delivered' && (
                          <div className="flex items-center text-green-600">
                            <Check className="h-4 w-4 mr-1" />
                            <span className="text-sm">Entregue em {formatDate(order.delivery.actual_delivery || '')}</span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Truck className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma entrega encontrada</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {statusFilter !== 'all' ? 
                  `Não há entregas com status "${translateDeliveryStatus(statusFilter)}" para exibir.` : 
                  "Não há entregas atribuídas a você no momento."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryOrdersPage;
