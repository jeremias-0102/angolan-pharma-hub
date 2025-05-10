
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
import { Search, Plus, MoreHorizontal, Edit2, Trash2, Building } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Supplier } from "@/types/models";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import DeleteConfirmationDialog from '@/components/admin/DeleteConfirmationDialog';
import SupplierFormModal from '@/components/admin/SupplierFormModal';
import { 
  getAllSuppliers, 
  addSupplier, 
  updateSupplier, 
  deleteSupplier
} from '@/services/supplierService';

const SuppliersManagement: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { toast } = useToast();

  // Load suppliers from database
  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const data = await getAllSuppliers();
        setSuppliers(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading suppliers:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar fornecedores",
          description: "Não foi possível carregar a lista de fornecedores.",
        });
        setIsLoading(false);
      }
    };
    
    loadSuppliers();
  }, [toast]);

  const filteredSuppliers = suppliers.filter((supplier) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      supplier.name.toLowerCase().includes(searchLower) ||
      supplier.tax_id.toLowerCase().includes(searchLower) ||
      supplier.contact_name.toLowerCase().includes(searchLower) ||
      supplier.email.toLowerCase().includes(searchLower)
    );
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const openAddModal = () => {
    setCurrentSupplier(null);
    setIsModalOpen(true);
  };

  const openEditModal = (supplier: Supplier) => {
    setCurrentSupplier(supplier);
    setIsModalOpen(true);
  };

  const openDeleteDialog = (supplier: Supplier) => {
    setSupplierToDelete(supplier);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveSupplier = async (supplier: Supplier) => {
    try {
      if (supplier.id) {
        // Update existing supplier
        const updatedSupplier = await updateSupplier(supplier);
        setSuppliers((prevSuppliers) =>
          prevSuppliers.map((p) => (p.id === updatedSupplier.id ? updatedSupplier : p))
        );
        toast({
          title: "Fornecedor atualizado",
          description: `${supplier.name} foi atualizado com sucesso.`,
        });
      } else {
        // Add new supplier
        const newSupplier = await addSupplier(supplier);
        setSuppliers((prevSuppliers) => [...prevSuppliers, newSupplier]);
        toast({
          title: "Fornecedor adicionado",
          description: `${supplier.name} foi adicionado com sucesso.`,
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving supplier:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar fornecedor",
        description: "Ocorreu um erro ao salvar o fornecedor.",
      });
    }
  };

  const handleDeleteSupplier = async () => {
    if (supplierToDelete) {
      try {
        await deleteSupplier(supplierToDelete.id);
        setSuppliers((prevSuppliers) =>
          prevSuppliers.filter((p) => p.id !== supplierToDelete.id)
        );
        toast({
          title: "Fornecedor excluído",
          description: `${supplierToDelete.name} foi excluído com sucesso.`,
        });
      } catch (error) {
        console.error('Error deleting supplier:', error);
        toast({
          variant: "destructive",
          title: "Erro ao excluir fornecedor",
          description: "Ocorreu um erro ao excluir o fornecedor.",
        });
      }
      setIsDeleteDialogOpen(false);
      setSupplierToDelete(null);
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestão de Fornecedores</h1>
        <Button onClick={openAddModal} className="bg-pharma-primary hover:bg-pharma-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Adicionar Fornecedor
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Buscar fornecedores por nome, ID fiscal, contato..."
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
            <p className="text-gray-500">Carregando fornecedores...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>ID Fiscal (NIF/NIPC)</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>Data de Registro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.length > 0 ? (
                  filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell>{supplier.tax_id}</TableCell>
                      <TableCell>{supplier.contact_name}</TableCell>
                      <TableCell>{supplier.email}</TableCell>
                      <TableCell>{supplier.phone}</TableCell>
                      <TableCell>{supplier.address}</TableCell>
                      <TableCell>{formatDate(supplier.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditModal(supplier)}>
                              <Edit2 className="mr-2 h-4 w-4" />
                              <span>Editar</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => openDeleteDialog(supplier)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Excluir</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      {searchQuery ? (
                        <div>
                          <p>Nenhum fornecedor encontrado com os termos de busca.</p>
                          <p className="text-sm">Tente outros termos ou adicione um novo fornecedor.</p>
                        </div>
                      ) : (
                        <div>
                          <Building className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                          <p>Nenhum fornecedor cadastrado.</p>
                          <p className="text-sm">Clique no botão "Adicionar Fornecedor" para começar.</p>
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

      {/* Supplier Form Modal */}
      <SupplierFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSupplier}
        supplier={currentSupplier}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteSupplier}
        title="Excluir Fornecedor"
        description={`Tem certeza que deseja excluir o fornecedor "${supplierToDelete?.name}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
};

export default SuppliersManagement;
