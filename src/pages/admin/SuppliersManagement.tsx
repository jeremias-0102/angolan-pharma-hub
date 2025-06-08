
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
import { Search, Plus, MoreHorizontal, Edit2, Trash2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Supplier } from "@/types/models";
import DeleteConfirmationDialog from '@/components/admin/DeleteConfirmationDialog';
import SupplierFormModal from '@/components/admin/SupplierFormModal';

const SuppliersManagement: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  const { toast } = useToast();

  // Mock data para desenvolvimento
  const mockSuppliers: Supplier[] = [
    {
      id: "1",
      name: "Farmácia Central Ltda",
      contact_name: "João Silva",
      email: "joao@farmaciacentral.co.ao",
      phone: "+244 923 456 789",
      address: "Rua da Saúde, 123, Luanda",
      website: "www.farmaciacentral.co.ao",
      notes: "Fornecedor principal de medicamentos",
      is_active: true,
      tax_id: "5432109876",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    },
    {
      id: "2",
      name: "MediSupply Angola",
      contact_name: "Maria Santos",
      email: "maria@medisupply.co.ao",
      phone: "+244 924 567 890",
      address: "Avenida Marginal, 456, Luanda",
      website: "www.medisupply.co.ao",
      notes: "Especialista em equipamentos médicos",
      is_active: true,
      tax_id: "6543210987",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z"
    }
  ];

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        setSuppliers(mockSuppliers);
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
      supplier.email.toLowerCase().includes(searchLower) ||
      supplier.phone.toLowerCase().includes(searchLower) ||
      (supplier.contact_name && supplier.contact_name.toLowerCase().includes(searchLower))
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
        setSuppliers((prevSuppliers) =>
          prevSuppliers.map((s) => (s.id === supplier.id ? supplier : s))
        );
        toast({
          title: "Fornecedor atualizado",
          description: `${supplier.name} foi atualizado com sucesso.`,
        });
      } else {
        // Add new supplier
        const newSupplier = {
          ...supplier,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
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
        setSuppliers((prevSuppliers) =>
          prevSuppliers.filter((s) => s.id !== supplierToDelete.id)
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
  
  const handleBack = () => {
    navigate('/admin');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-5 w-5 mr-1" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Gestão de Fornecedores</h1>
        </div>
        <Button onClick={openAddModal} className="bg-pharma-primary hover:bg-pharma-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Adicionar Fornecedor
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Buscar fornecedores por nome, email, telefone..."
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
                  <TableHead>Contato</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.length > 0 ? (
                  filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell>{supplier.contact_name || '-'}</TableCell>
                      <TableCell>{supplier.email}</TableCell>
                      <TableCell>{supplier.phone}</TableCell>
                      <TableCell>
                        {supplier.is_active ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Ativo
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Inativo
                          </Badge>
                        )}
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
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Nenhum fornecedor encontrado. Tente outros termos de busca ou adicione um novo fornecedor.
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
