import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Supplier } from '@/types/models';

interface SupplierFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (supplier: Supplier) => void;
  supplier: Supplier | null;
}

const supplierSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  tax_id: z.string().min(3, 'ID fiscal deve ter pelo menos 3 caracteres'),
  contact_name: z.string().min(3, 'Nome do contato deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(9, 'Telefone deve ter pelo menos 9 dígitos'),
  address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

const SupplierFormModal: React.FC<SupplierFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  supplier 
}) => {
  const form = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: supplier?.name || '',
      tax_id: supplier?.tax_id || '',
      contact_name: supplier?.contact_name || '',
      email: supplier?.email || '',
      phone: supplier?.phone || '',
      address: supplier?.address || '',
    }
  });

  const handleSubmit = async (values: SupplierFormValues) => {
    const supplierData: Supplier = {
      id: supplier?.id || '',
      name: values.name,
      tax_id: values.tax_id,
      contact_name: values.contact_name,
      email: values.email,
      phone: values.phone,
      address: values.address,
      is_active: supplier?.is_active !== undefined ? supplier.is_active : true,
      created_at: supplier?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    onSave(supplierData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{supplier ? 'Editar Fornecedor' : 'Adicionar Novo Fornecedor'}</DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[70vh] overflow-y-auto py-4 pr-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Empresa</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do fornecedor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tax_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Fiscal (NIF/NIPC)</FormLabel>
                      <FormControl>
                        <Input placeholder="NIF ou NIPC" {...field} />
                      </FormControl>
                      <FormDescription>
                        Número de identificação fiscal da empresa
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contact_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pessoa de Contato</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do contato" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="+244 923 456 789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Endereço completo do fornecedor" 
                        {...field} 
                        className="resize-none"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-4 pt-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-pharma-primary hover:bg-pharma-primary/90"
                >
                  {supplier ? 'Salvar Alterações' : 'Adicionar Fornecedor'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupplierFormModal;
