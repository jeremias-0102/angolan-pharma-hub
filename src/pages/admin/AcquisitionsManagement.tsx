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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { 
  PlusCircle, 
  Search, 
  MoreHorizontal, 
  Eye, 
  Pencil, 
  CheckCircle,
  X,
  Package,
  ArrowLeft
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PurchaseOrder, PurchaseOrderStatus } from "@/types/models";
import { useToast } from "@/components/ui/use-toast";
import PurchaseOrderFormModal from "@/components/admin/PurchaseOrderFormModal";
import ReceiveItemsModal from "@/components/admin/ReceiveItemsModal";

// Mock data - would be replaced with API calls in production
const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: "PO-001",
    supplier_id: "SUP-001",
    supplier_name: "Supplier 1",
    status: "draft",
    order_date: "2023-01-20T10:00:00Z",
    expected_delivery: "2023-01-30T10:00:00Z",
    total: 15000,
    notes: "Encomenda inicial de teste",
    created_at: "2023-01-20T10:00:00Z",
    updated_at: "2023-01-20T10:00:00Z",
    items: [
      {
        id: "POI-001",
        purchase_order_id: "PO-001",
        product_id: "PROD-001",
        product_name: "Product 1",
        quantity_ordered: 50,
        quantity_received: 0,
        unit_price: 300,
        total: 15000
      }
    ]
  },
  {
    id: "PO-002",
    supplier_id: "SUP-002",
    supplier_name: "Supplier 2",
    status: "submitted",
    order_date: "2023-02-15T14:30:00Z",
    expected_delivery: "2023-02-25T14:30:00Z",
    total: 22000,
    notes: "Revisar prazos de entrega",
    created_at: "2023-02-15T14:30:00Z",
    updated_at: "2023-02-15T14:30:00Z",
    items: [
      {
        id: "POI-002",
        purchase_order_id: "PO-002",
        product_id: "PROD-002",
        product_name: "Product 2",
        quantity_ordered: 100,
        quantity_received: 0,
        unit_price: 220,
        total: 22000
      }
    ]
  },
  {
    id: "PO-003",
    supplier_id: "SUP-001",
    supplier_name: "Supplier 1",
    status: "received",
    order_date: "2023-03-01T09:00:00Z",
    expected_delivery: "2023-03-10T09:00:00Z",
    actual_delivery: "2023-03-05T11:00:00Z",
    total: 8000,
    notes: "Aguardando segunda parte da entrega",
    created_at: "2023-03-01T09:00:00Z",
    updated_at: "2023-03-05T11:00:00Z",
    items: [
      {
        id: "POI-003",
        purchase_order_id: "PO-003",
        product_id: "PROD-003",
        product_name: "Product 3",
        quantity_ordered: 30,
        quantity_received: 15,
        unit_price: 270,
        total: 8100
      }
    ]
  },
  {
    id: "PO-004",
    supplier_id: "SUP-003",
    supplier_name: "Supplier 3",
    status: "received",
    order_date: "2023-03-10T16:45:00Z",
    expected_delivery: "2023-03-20T16:45:00Z",
    actual_delivery: "2023-03-15T12:00:00Z",
    total: 12000,
    notes: "Pagamento confirmado",
    created_at: "2023-03-10T16:45:00Z",
    updated_at: "2023-03-15T12:00:00Z",
    items: [
      {
        id: "POI-004",
        purchase_order_id: "PO-004",
        product_id: "PROD-004",
        product_name: "Product 4",
        quantity_ordered: 60,
        quantity_received: 60,
        unit_price: 200,
        total: 12000
      }
    ]
  },
  {
    id: "PO-005",
    supplier_id: "SUP-002",
    supplier_name: "Supplier 2",
    status: "cancelled",
    order_date: "2023-04-01T11:20:00Z",
    expected_delivery: "2023-04-10T11:20:00Z",
    total: 5000,
    notes: "Pedido cancelado devido a atraso na entrega",
    created_at: "2023-04-01T11:20:00Z",
    updated_at: "2023-04-02T08:00:00Z",
    items: [
      {
        id: "POI-005",
        purchase_order_id: "PO-005",
        product_id: "PROD-005",
        product_name: "Product 5",
        quantity_ordered: 20,
        quantity_received: 0,
        unit_price: 250,
        total: 5000
      }
    ]
  }
];

const AcquisitionsManagement: React.FC = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(mockPurchaseOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [currentPurchaseOrder, setCurrentPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const { toast } = useToast();
  
  const navigate = useNavigate();

  const filteredPurchaseOrders = purchaseOrders.filter((order) =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.supplier_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleEdit = (order: PurchaseOrder) => {
    setCurrentPurchaseOrder(order);
    setIsFormOpen(true);
  };

  const handleReceiveItems = (order: PurchaseOrder) => {
    setSelectedPurchaseOrder(order);
    setIsReceiveModalOpen(true);
  };

  const handleSavePurchaseOrder = (purchaseOrder: PurchaseOrder) => {
    if (purchaseOrder.id) {
      // Update existing purchase order
      setPurchaseOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === purchaseOrder.id ? purchaseOrder : order
        )
      );
      toast({
        title: "Aquisição atualizada",
        description: `A aquisição ${purchaseOrder.id} foi atualizada com sucesso.`,
      });
    } else {
      // Add new purchase order with generated ID
      const newPurchaseOrder: PurchaseOrder = {
        ...purchaseOrder,
        id: `PO-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setPurchaseOrders((prevOrders) => [...prevOrders, newPurchaseOrder]);
      toast({
        title: "Aquisição adicionada",
        description: `A aquisição ${newPurchaseOrder.id} foi adicionada com sucesso.`,
      });
    }
    setIsFormOpen(false);
  };

  const handleUpdateStatus = (orderId: string, newStatus: PurchaseOrderStatus) => {
    setPurchaseOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus, updated_at: new Date().toISOString() } : order
      )
    );

    toast({
      title: "Status atualizado",
      description: `O status da aquisição ${orderId} foi atualizado para ${newStatus}.`,
    });
  };

  const handleBack = () => {
    navigate('/admin');
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  // Translate status to Portuguese
  const translateStatus = (status: PurchaseOrderStatus): string => {
    const statusMap: Record<PurchaseOrderStatus, string> = {
      draft: "Rascunho",
      submitted: "Enviado",
      received: "Recebido",
      cancelled: "Cancelado",
      sent: "Enviado",
      partial: "Parcial",
      complete: "Completo"
    };
    return statusMap[status] || status;
  };

  // Get badge variant based on status
  const getStatusBadgeVariant = (status: PurchaseOrderStatus) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "submitted":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "received":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "sent":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "partial":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "complete":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button variant="ghost" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-5 w-5 mr-1" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Gestão de Aquisições</h1>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Nova Aquisição
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Buscar aquisições por ID ou fornecedor..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID da Aquisição</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPurchaseOrders.length > 0 ? (
                filteredPurchaseOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{formatDate(order.created_at)}</TableCell>
                    <TableCell>{order.supplier_name}</TableCell>
                    <TableCell>{order.total}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadgeVariant(order.status)}>
                        {translateStatus(order.status)}
                      </Badge>
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
                          <DropdownMenuItem onClick={() => handleEdit(order)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                          
                          {order.status !== "received" && (
                            <DropdownMenuItem onClick={() => handleReceiveItems(order)}>
                              <Package className="mr-2 h-4 w-4" />
                              <span>Receber Items</span>
                            </DropdownMenuItem>
                          )}
                          
                          {order.status !== "received" && order.status !== "cancelled" && (
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "received")}>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                              <span>Marcar como Completo</span>
                            </DropdownMenuItem>
                          )}
                          
                          {order.status !== "cancelled" && (
                            <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "cancelled")}>
                              <X className="mr-2 h-4 w-4 text-red-600" />
                              <span>Cancelar Aquisição</span>
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
                    Nenhuma aquisição encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <PurchaseOrderFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSavePurchaseOrder}
        purchaseOrder={currentPurchaseOrder}
      />

      <ReceiveItemsModal
        isOpen={isReceiveModalOpen}
        onClose={() => setIsReceiveModalOpen(false)}
        purchaseOrder={selectedPurchaseOrder}
        onItemsReceived={() => {
          setIsReceiveModalOpen(false);
          // Refresh purchase orders or update specific order
          setPurchaseOrders([...purchaseOrders]);
        }}
      />
    </div>
  );
};

export default AcquisitionsManagement;
