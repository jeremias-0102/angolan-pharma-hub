import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Edit, Trash2, MoreHorizontal, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Supplier } from '@/types/models';
import SupplierFormModal from '@/components/admin/SupplierFormModal';
import DeleteConfirmationDialog from '@/components/admin/DeleteConfirmationDialog';

// Mock data - replace with API calls in production
const mockSuppliers: Supplier[] = [
  {
    id: "SUP-001",
    name: "Pharma Inc",
    tax_id: "123456789",
    contact_name: "John Doe",
    email: "john.doe@pharma.com",
    phone: "923000000",
    address: "Rua Exemplo, 123",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
  },
  {
    id: "SUP-002",
    name: "Med Supply Co",
    tax_id: "987654321",
    contact_name: "Jane Smith",
    email: "jane.smith@medsupply.com",
    phone: "924000000",
    address: "Av Principal, 456",
    created_at: "2023-02-15T00:00:00Z",
    updated_at: "2023-02-15T00:00:00Z",
  },
  {
    id: "SUP-003",
    name: "Global Health Ltd",
    tax_id: "456789123",
    contact_name: "Alice Johnson",
    email: "alice.johnson@globalhealth.com",
    phone: "925000000",
    address: "Travessa da Saúde, 789",
    created_at: "2023-03-20T00:00:00Z",
    updated_at: "2023-03-20T00:00:00Z",
  },
];

const SuppliersManagement = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier | null>(null);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.tax_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.contact_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openForm = (supplier?: Supplier) => {
    setCurrentSupplier(supplier || null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setCurrentSupplier(null);
  };

  const saveSupplier = (supplier: Supplier) => {
    if (supplier.id) {
      // Update existing supplier
      setSuppliers((prevSuppliers) =>
        prevSuppliers.map((s) => (s.id === supplier.id ? supplier : s))
      );
    } else {
      // Add new supplier with generated ID
      const newSupplier: Supplier = {
        ...supplier,
        id: String(Date.now()),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setSuppliers((prevSuppliers) => [...prevSuppliers, newSupplier]);
    }
    closeForm();
  };

  const openDeleteDialog = (supplier: Supplier) => {
    setSupplierToDelete(supplier);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setSupplierToDelete(null);
  };

  const deleteSupplier = () => {
    if (supplierToDelete) {
      setSuppliers((prevSuppliers) =>
        prevSuppliers.filter((s) => s.id !== supplierToDelete.id)
      );
      closeDeleteDialog();
    }
  };

  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/admin');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button variant="ghost" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-5 w-5 mr-1" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Gestão de Fornecedores</h1>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Fornecedor
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            type="text"
            placeholder="Buscar fornecedor..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>NIF</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSuppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell className="font-medium">{supplier.name}</TableCell>
                <TableCell>{supplier.tax_id}</TableCell>
                <TableCell>{supplier.contact_name}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{supplier.phone}</TableCell>
                <TableCell>{supplier.address}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openForm(supplier)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Editar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openDeleteDialog(supplier)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Excluir</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <SupplierFormModal
        isOpen={isFormOpen}
        onClose={closeForm}
        onSave={saveSupplier}
        supplier={currentSupplier}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={deleteSupplier}
        title="Excluir Fornecedor"
        description={`Tem certeza que deseja excluir o fornecedor ${supplierToDelete?.name}?`}
      />
    </div>
  );
};

export default SuppliersManagement;
