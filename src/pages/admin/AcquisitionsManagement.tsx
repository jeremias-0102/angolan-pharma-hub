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
import { Badge } from "@/components/ui/badge";
import { Search, Plus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PurchaseOrder, PurchaseOrderStatus } from "@/types/models";

const AcquisitionsManagement: React.FC = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const { toast } = useToast();

  // Mock data para desenvolvimento
  const mockPurchaseOrders: PurchaseOrder[] = [
    {
      id: "PO-001",
      supplier_id: "1",
      supplier_name: "Farmácia Central Ltda",
      status: "pending",
      order_date: "2024-12-08",
      expected_delivery: "2024-12-15",
      total: 125000,
      notes: "Pedido de medicamentos básicos",
      created_at: "2024-12-08T10:00:00Z",
      updated_at: "2024-12-08T10:00:00Z",
      items: []
    },
    {
      id: "PO-002",
      supplier_id: "2",
      supplier_name: "MediSupply Angola",
      status: "ordered",
      order_date: "2024-12-07",
      expected_delivery: "2024-12-14",
      total: 85000,
      notes: "Pedido de vitaminas e suplementos",
      created_at: "2024-12-07T09:00:00Z",
      updated_at: "2024-12-07T09:00:00Z",
      items: []
    }
  ];

  useEffect(() => {
    const loadPurchaseOrders = async () => {
      try {
        setPurchaseOrders(mockPurchaseOrders);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading purchase orders:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar aquisições",
          description: "Não foi possível carregar a lista de aquisições.",
        });
        setIsLoading(false);
      }
    };
    
    loadPurchaseOrders();
  }, [toast]);

  const filteredPurchaseOrders = purchaseOrders.filter((po) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      po.id.toLowerCase().includes(searchLower) ||
      po.supplier_name.toLowerCase().includes(searchLower)
    );
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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

  // Translate status to Portuguese
  const translateStatus = (status: PurchaseOrderStatus): string => {
    const statusMap: Record<PurchaseOrderStatus, string> = {
      pending: "Pendente",
      ordered: "Pedido",
      received: "Recebido",
      cancelled: "Cancelado"
    };
    return statusMap[status] || status;
  };

  // Get badge variant based on status
  const getStatusBadgeVariant = (status: PurchaseOrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "ordered":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "received":
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
          <h1 className="text-2xl font-bold">Gestão de Aquisições</h1>
        </div>
        <Button className="bg-pharma-primary hover:bg-pharma-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Nova Aquisição
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
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
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-pharma-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Carregando aquisições...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Data do Pedido</TableHead>
                  <TableHead>Entrega Prevista</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchaseOrders.length > 0 ? (
                  filteredPurchaseOrders.map((po) => (
                    <TableRow key={po.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{po.id}</TableCell>
                      <TableCell>{po.supplier_name}</TableCell>
                      <TableCell>{new Date(po.order_date).toLocaleDateString('pt-AO')}</TableCell>
                      <TableCell>{new Date(po.expected_delivery).toLocaleDateString('pt-AO')}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusBadgeVariant(po.status)}>
                          {translateStatus(po.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(po.total)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Nenhuma aquisição encontrada. Tente outros termos de busca ou crie uma nova aquisição.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcquisitionsManagement;
