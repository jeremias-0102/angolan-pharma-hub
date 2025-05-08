
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Product, Batch } from '@/types/models';
import { useToast } from '@/components/ui/use-toast';
import { format, differenceInDays, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Check, Plus, X, Edit2, Trash2 } from 'lucide-react';
import BatchFormDialog from './BatchFormDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

interface BatchesManagementProps {
  product: Product;
}

const BatchesManagement: React.FC<BatchesManagementProps> = ({ product }) => {
  const [batches, setBatches] = useState<Batch[]>(product.batches || []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentBatch, setCurrentBatch] = useState<Batch | null>(null);
  const [batchToDelete, setBatchToDelete] = useState<Batch | null>(null);

  const { toast } = useToast();

  const openAddForm = () => {
    setCurrentBatch(null);
    setIsFormOpen(true);
  };

  const openEditForm = (batch: Batch) => {
    setCurrentBatch(batch);
    setIsFormOpen(true);
  };

  const openDeleteDialog = (batch: Batch) => {
    setBatchToDelete(batch);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveBatch = (batch: Batch) => {
    if (batch.id) {
      // Update existing batch
      setBatches((prevBatches) =>
        prevBatches.map((b) => (b.id === batch.id ? batch : b))
      );
      toast({
        title: "Lote atualizado",
        description: `O lote ${batch.batch_number} foi atualizado com sucesso.`,
      });
    } else {
      // Add new batch with generated ID
      const newBatch: Batch = {
        ...batch,
        id: String(Date.now()),
        product_id: product.id,
        created_at: new Date().toISOString(),
      };
      setBatches((prevBatches) => [...prevBatches, newBatch]);
      toast({
        title: "Lote adicionado",
        description: `O lote ${batch.batch_number} foi adicionado com sucesso.`,
      });
    }
    setIsFormOpen(false);
  };

  const handleDeleteBatch = () => {
    if (batchToDelete) {
      setBatches((prevBatches) =>
        prevBatches.filter((b) => b.id !== batchToDelete.id)
      );
      toast({
        title: "Lote excluído",
        description: `O lote ${batchToDelete.batch_number} foi excluído com sucesso.`,
      });
      setIsDeleteDialogOpen(false);
      setBatchToDelete(null);
    }
  };

  // Format date with day, month and year
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return "Data inválida";
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  // Check if batch is expired or near expiry
  const getExpiryStatus = (expiryDateStr: string) => {
    try {
      const expiryDate = parseISO(expiryDateStr);
      if (!isValid(expiryDate)) return { status: 'invalid', days: 0 };
      
      const today = new Date();
      const daysToExpiry = differenceInDays(expiryDate, today);
      
      if (daysToExpiry < 0) {
        return { status: 'expired', days: Math.abs(daysToExpiry) };
      } else if (daysToExpiry <= 30) {
        return { status: 'warning', days: daysToExpiry };
      } else {
        return { status: 'ok', days: daysToExpiry };
      }
    } catch (error) {
      return { status: 'invalid', days: 0 };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Lotes e Estoque</h3>
        <Button onClick={openAddForm} className="bg-pharma-primary hover:bg-pharma-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Adicionar Lote
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número do Lote</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Data de Fabricação</TableHead>
              <TableHead>Data de Validade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batches.length > 0 ? (
              batches.map((batch) => {
                const expiryStatus = getExpiryStatus(batch.expiry_date);
                
                return (
                  <TableRow key={batch.id}>
                    <TableCell className="font-medium">{batch.batch_number}</TableCell>
                    <TableCell>{batch.quantity} unidades</TableCell>
                    <TableCell>{formatDate(batch.manufacture_date)}</TableCell>
                    <TableCell>{formatDate(batch.expiry_date)}</TableCell>
                    <TableCell>
                      {expiryStatus.status === 'expired' ? (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          <X className="mr-1 h-3 w-3" /> Expirado há {expiryStatus.days} dias
                        </Badge>
                      ) : expiryStatus.status === 'warning' ? (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Expira em {expiryStatus.days} dias
                        </Badge>
                      ) : expiryStatus.status === 'ok' ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <Check className="mr-1 h-3 w-3" /> Válido
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                          Data inválida
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 mr-2"
                        onClick={() => openEditForm(batch)}
                      >
                        <Edit2 className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => openDeleteDialog(batch)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-gray-500">
                  Nenhum lote cadastrado para este produto.
                  <div className="mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={openAddForm}
                      className="mx-auto"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar primeiro lote
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <BatchFormDialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveBatch}
        batch={currentBatch}
        productId={product.id}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteBatch}
        title="Excluir Lote"
        description={`Tem certeza que deseja excluir o lote ${batchToDelete?.batch_number}? Esta ação não pode ser desfeita.`}
      />
    </div>
  );
};

export default BatchesManagement;
