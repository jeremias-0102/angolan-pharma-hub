
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Batch } from '@/types/models';
import { format, parse } from 'date-fns';

interface BatchFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (batch: Batch) => void;
  batch: Batch | null;
  productId: string;
}

// Form schema validation
const formSchema = z.object({
  batch_number: z.string().min(3, { message: "O número do lote deve ter pelo menos 3 caracteres" }),
  quantity: z.number().int().positive({ message: "A quantidade deve ser um número inteiro positivo" }),
  manufacture_date: z.string().refine(value => {
    try {
      const date = parse(value, 'yyyy-MM-dd', new Date());
      return !isNaN(date.getTime());
    } catch {
      return false;
    }
  }, { message: "Data de fabricação inválida" }),
  expiry_date: z.string().refine(value => {
    try {
      const date = parse(value, 'yyyy-MM-dd', new Date());
      return !isNaN(date.getTime());
    } catch {
      return false;
    }
  }, { message: "Data de validade inválida" }),
}).refine(data => {
  const manufactureDate = parse(data.manufacture_date, 'yyyy-MM-dd', new Date());
  const expiryDate = parse(data.expiry_date, 'yyyy-MM-dd', new Date());
  return expiryDate > manufactureDate;
}, {
  message: "A data de validade deve ser posterior à data de fabricação",
  path: ["expiry_date"],
});

type FormValues = z.infer<typeof formSchema>;

const BatchFormDialog: React.FC<BatchFormDialogProps> = ({ isOpen, onClose, onSave, batch, productId }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      batch_number: batch?.batch_number || '',
      quantity: batch?.quantity || 0,
      manufacture_date: batch?.manufacture_date 
        ? format(new Date(batch.manufacture_date), 'yyyy-MM-dd')
        : format(new Date(), 'yyyy-MM-dd'),
      expiry_date: batch?.expiry_date 
        ? format(new Date(batch.expiry_date), 'yyyy-MM-dd')
        : format(new Date(new Date().setFullYear(new Date().getFullYear() + 2)), 'yyyy-MM-dd'),
    },
  });

  const handleSubmit = (values: FormValues) => {
    const batchData: Batch = {
      id: batch?.id || '',
      product_id: productId,
      batch_number: values.batch_number,
      quantity: values.quantity,
      manufacture_date: new Date(values.manufacture_date).toISOString(),
      expiry_date: new Date(values.expiry_date).toISOString(),
      created_at: batch?.created_at || new Date().toISOString(),
    };
    
    onSave(batchData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {batch ? 'Editar Lote' : 'Adicionar Novo Lote'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="batch_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número do Lote</FormLabel>
                  <FormControl>
                    <Input placeholder="B2023-001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade (unidades)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                      min={1}
                      step={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="manufacture_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Fabricação</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="expiry_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Validade</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {batch ? 'Atualizar' : 'Adicionar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BatchFormDialog;
