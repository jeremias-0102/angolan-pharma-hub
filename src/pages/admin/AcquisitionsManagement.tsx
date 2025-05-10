
import React, { useState, useEffect } from 'react';
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
import { 
  Badge 
} from "@/components/ui/badge";
import { Search, Plus, MoreHorizontal, Edit2, Trash2, FileText, ClipboardCheck } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { PurchaseOrder, Supplier } from "@/types/models";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import DeleteConfirmationDialog from '@/components/admin/DeleteConfirmationDialog';
import { 
  getAllPurchaseOrders, 
  createPurchaseOrder, 
  updatePurchaseOrder, 
  deletePurchaseOrder,
  receiveItems
} from '@/services/acquisitionService';
import { getAllSuppliers } from '@/services/supplierService';
import PurchaseOrderFormModal from '@/components/admin/PurchaseOrderFormModal';
import ReceiveItemsModal from '@/components/admin/ReceiveItemsModal';

const AcquisitionsManagement: React.FC = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isReceiveModalOpen, setIsReceiveModalOpen] = useState(false);
  const [currentPurchaseOrder, setCurrentPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [purchaseOrderToDelete, setPurchaseOrderToDelete] = useState<PurchaseOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();

  // Load purchase orders and suppliers from database
  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersData, suppliersData] = await Promise.all([
          getAllPurchaseOrders(),
          getAllSuppliers()
        ]);
        setPurchaseOrders(ordersData);
        setSuppliers(suppliersData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar as ordens de compra.",
        });
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);

  const filteredPurchaseOrders = purchaseOrders.filter((order) => {
    const searchLower = searchQuery.toLowerCase();
    const supplier = suppliers.find(s => s.id === order.supplier_id);
    
    return (
      supplier?.name.toLowerCase().includes(searchLower) ||
      order.id.toLowerCase().includes(searchLower) ||
      order.status.toLowerCase().includes(searchLower)
    );
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const openAddModal = () => {
    setCurrentPurchaseOrder(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (order: PurchaseOrder) => {
    setCurrentPurchaseOrder(order);
    setIsFormModalOpen(true);
  };

  const openReceiveModal = (order: PurchaseOrder) => {
    setCurrentPurchaseOrder(order);
    setIsReceiveModalOpen(true);
  };

  const openDeleteDialog = (order: PurchaseOrder) => {
    setPurchaseOrderToDelete(order);
    setIsDeleteDialogOpen(true);
  };

  const handleSavePurchaseOrder = async (order: PurchaseOrder) => {
    try {
      if (order.id) {
        // Update existing order
        const updatedOrder = await updatePurchaseOrder(order);
        setPurchaseOrders((prevOrders) =>
          prevOrders.map((p) => (p.id === updatedOrder.id ? updatedOrder : p))
        );
        toast({
          title: "Ordem de compra atualizada",
          description: `A ordem de compra foi atualizada com sucesso.`,
        });
      } else {
        // Add new order
        const newOrder = await createPurchaseOrder(order);
        setPurchaseOrders((prevOrders) => [...prevOrders, newOrder]);
        toast({
          title: "Ordem de compra adicionada",
          description: `A ordem de compra foi adicionada com sucesso.`,
        });
      }
      setIsFormModalOpen(false);
    } catch (error) {
      console.error('Error saving purchase order:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar ordem de compra",
        description: "Ocorreu um erro ao salvar a ordem de compra.",
      });
    }
  };

  const handleDeletePurchaseOrder = async () => {
    if (purchaseOrderToDelete) {
      try {
        await deletePurchaseOrder(purchaseOrderToDelete.id);
        setPurchaseOrders((prevOrders) =>
          prevOrders.filter((p) => p.id !== purchaseOrderToDelete.id)
        );
        toast({
          title: "Ordem de compra excluída",
          description: `A ordem de compra foi excluída com sucesso.`,
        });
      } catch (error) {
        console.error('Error deleting purchase order:', error);
        toast({
          variant: "destructive",
          title: "Erro ao excluir ordem de compra",
          description: "Ocorreu um erro ao excluir a ordem de compra.",
        });
      }
      setIsDeleteDialogOpen(false);
      setPurchaseOrderToDelete(null);
    }
  };

  const handleReceiveItems = async (orderId: string, receivedItems: any[]) => {
    try {
      const updatedOrder = await receiveItems(orderId, receivedItems);
      setPurchaseOrders((prevOrders) =>
        prevOrders.map((p) => (p.id === updatedOrder.id ? updatedOrder : p))
      );
      toast({
        title: "Itens recebidos",
        description: `Os itens foram recebidos e o estoque foi atualizado com sucesso.`,
      });
      setIsReceiveModalOpen(false);
    } catch (error) {
      console.error('Error receiving items:', error);
      toast({
        variant: "destructive",
        title: "Erro ao receber itens",
        description: "Ocorreu um erro ao processar os itens recebidos.",
      });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Get supplier name
  const getSupplierName = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : 'Fornecedor não encontrado';
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'draft':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Rascunho</Badge>;
      case 'sent':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Enviado</Badge>;
      case 'partial':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Parcial</Badge>;
      case 'complete':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Completo</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestão de Aquisições</h1>
        <Button onClick={openAddModal} className="bg-pharma-primary hover:bg-pharma-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Nova Ordem de Compra
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Buscar por fornecedor, número ou status..."
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
            <p className="text-gray-500">Carregando ordens de compra...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nº</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchaseOrders.length > 0 ? (
                  filteredPurchaseOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id.slice(0, 8)}</TableCell>
                      <TableCell>{getSupplierName(order.supplier_id)}</TableCell>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{order.items.length}</TableCell>
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
                            <DropdownMenuItem onClick={() => openEditModal(order)}>
                              <Edit2 className="mr-2 h-4 w-4" />
                              <span>Editar</span>
                            </DropdownMenuItem>
                            {(order.status === 'sent' || order.status === 'partial') && (
                              <DropdownMenuItem onClick={() => openReceiveModal(order)}>
                                <ClipboardCheck className="mr-2 h-4 w-4" />
                                <span>Receber Itens</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              <span>Detalhes</span>
                            </DropdownMenuItem>
                            {order.status !== 'complete' && (
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => openDeleteDialog(order)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Excluir</span>
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
                      {searchQuery ? (
                        <div>
                          <p>Nenhuma ordem de compra encontrada com os termos de busca.</p>
                          <p className="text-sm">Tente outros termos ou adicione uma nova ordem.</p>
                        </div>
                      ) : (
                        <div>
                          <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                          <p>Nenhuma ordem de compra cadastrada.</p>
                          <p className="text-sm">Clique no botão "Nova Ordem de Compra" para começar.</p>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Form Modal will be implemented separately */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">
              {currentPurchaseOrder ? "Editar Ordem de Compra" : "Nova Ordem de Compra"}
            </h2>
            <p className="mb-4 text-gray-500">O componente de formulário completo será implementado em seguida.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsFormModalOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-pharma-primary" onClick={() => setIsFormModalOpen(false)}>
                Salvar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Receive Items Modal will be implemented separately */}
      {isReceiveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">Receber Itens</h2>
            <p className="mb-4 text-gray-500">O componente de recebimento de itens será implementado em seguida.</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsReceiveModalOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-pharma-primary" onClick={() => setIsReceiveModalOpen(false)}>
                Confirmar Recebimento
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeletePurchaseOrder}
        title="Excluir Ordem de Compra"
        description="Tem certeza que deseja excluir esta ordem de compra? Esta ação não pode ser desfeita."
      />
    </div>
  );
};

export default AcquisitionsManagement;
