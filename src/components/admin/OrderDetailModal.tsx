
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  Clock, 
  Calendar,
  User,
  MapPin,
  Phone,
  CreditCard,
  XCircle,
  ClipboardEdit
} from 'lucide-react';
import { Order, OrderStatus } from '@/types/models';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onUpdateStatus: (newStatus: OrderStatus) => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ isOpen, onClose, order, onUpdateStatus }) => {
  if (!order) return null;

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
      return format(parseISO(dateString), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
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

  // Get status options
  const getStatusOptions = (): OrderStatus[] => {
    const allStatuses: OrderStatus[] = ["pending", "paid", "processing", "ready", "shipping", "delivered", "cancelled"];
    return allStatuses;
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

  // Get delivery status badge
  const getDeliveryBadge = () => {
    if (!order.delivery) return null;
    
    switch (order.delivery.status) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pendente</Badge>;
      case "assigned":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Atribuído</Badge>;
      case "in_progress":
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Em andamento</Badge>;
      case "delivered":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Entregue</Badge>;
      case "failed":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Falha na entrega</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Pedido {order.id}</span>
            <Badge variant="outline" className={getStatusBadgeVariant(order.status)}>
              {translateStatus(order.status)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 flex items-center mb-2">
                <Calendar className="mr-2 h-4 w-4" /> Data do Pedido
              </h3>
              <p className="text-base">{formatDate(order.created_at)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 flex items-center mb-2">
                <CreditCard className="mr-2 h-4 w-4" /> Método de Pagamento
              </h3>
              <p className="text-base">{order.payment_method}</p>
            </div>
          </div>

          <Separator />

          {/* Address Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 flex items-center mb-3">
              <MapPin className="mr-2 h-4 w-4" /> Informações de Entrega
            </h3>
            
            <div className="bg-gray-50 p-3 rounded-md">
              {order.delivery ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    {getDeliveryBadge()}
                  </div>
                  <p className="text-sm">
                    <span className="font-medium">Endereço:</span> {order.delivery.address}, {order.delivery.district}, {order.delivery.city}
                    {order.delivery.postal_code && `, ${order.delivery.postal_code}`}
                  </p>
                  
                  {order.delivery.estimated_delivery && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="mr-1 h-3.5 w-3.5" />
                      <span>Previsão de entrega: {formatDate(order.delivery.estimated_delivery)}</span>
                    </div>
                  )}
                  
                  {order.delivery.actual_delivery && (
                    <div className="flex items-center text-sm text-green-600">
                      <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                      <span>Entregue em: {formatDate(order.delivery.actual_delivery)}</span>
                    </div>
                  )}
                  
                  {order.delivery.notes && (
                    <p className="text-sm italic text-gray-500">{order.delivery.notes}</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Não há informações de entrega disponíveis.</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Items Section */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 flex items-center mb-3">
              <Package className="mr-2 h-4 w-4" /> Itens do Pedido
            </h3>
            
            <div className="border rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produto
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantidade
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço Unit.
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {item.product_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {formatCurrency(item.unit_price)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  {order.discount > 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-sm font-medium text-right">
                        Desconto
                      </td>
                      <td className="px-4 py-2 text-sm font-medium text-right text-red-600">
                        -{formatCurrency(order.discount)}
                      </td>
                    </tr>
                  )}
                  <tr className="bg-gray-50">
                    <td colSpan={3} className="px-4 py-3 text-sm font-bold text-right">
                      Total do Pedido
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-right text-pharma-primary">
                      {formatCurrency(order.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {order.notes && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-gray-500 flex items-center mb-2">
                  <ClipboardEdit className="mr-2 h-4 w-4" /> Observações
                </h3>
                <p className="text-sm italic bg-gray-50 p-3 rounded-md">{order.notes}</p>
              </div>
            </>
          )}

          <Separator />
          
          {/* Actions Section */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center">
              <span className="text-sm font-medium mr-3">Atualizar Status:</span>
              <div className="w-64">
                <Select 
                  value={order.status} 
                  onValueChange={(value: OrderStatus) => onUpdateStatus(value)}
                  disabled={order.status === 'delivered' || order.status === 'cancelled'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    {getStatusOptions().map((status) => (
                      <SelectItem 
                        key={status} 
                        value={status} 
                        disabled={order.status === status}
                      >
                        {translateStatus(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailModal;
