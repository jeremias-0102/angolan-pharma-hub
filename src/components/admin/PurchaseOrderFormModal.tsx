import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, parseISO, isValid } from 'date-fns';
import { cn } from "@/lib/utils";
import { PlusCircle, Trash } from "lucide-react";
import { PurchaseOrder, PurchaseOrderItem, PurchaseOrderStatus, Supplier } from '@/types/models';
import SupplierFormModal from '@/components/admin/SupplierFormModal';
import { useToast } from "@/hooks/use-toast";
import { addSupplier } from '@/services/supplierService';

// Custom DatePicker component to replace the imported one
const DatePicker = ({ onSelect, defaultValue }) => {
  const [date, setDate] = useState(defaultValue || new Date());
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (selectedDate) => {
    setDate(selectedDate);
    setIsOpen(false);
    onSelect(selectedDate);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Selecione uma data</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

interface PurchaseOrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (purchaseOrder: PurchaseOrder) => void;
  purchaseOrder: PurchaseOrder | null;
  suppliers: Supplier[];
}

// Schema for the purchase order form
const purchaseOrderSchema = z.object({
  supplier_id: z.string().min(1, 'Fornecedor é obrigatório'),
  order_date: z.date(),
  expected_delivery: z.date(),
  notes: z.string().optional(),
  status: z.enum(['draft', 'submitted', 'received', 'cancelled', 'sent', 'partial', 'complete'] as const),
});

type PurchaseOrderFormValues = z.infer<typeof purchaseOrderSchema>;

const PurchaseOrderFormModal: React.FC<PurchaseOrderFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  purchaseOrder,
  suppliers
}) => {
  const [items, setItems] = useState<PurchaseOrderItem[]>(purchaseOrder?.items || []);
  const [isSupplierFormOpen, setIsSupplierFormOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      supplier_id: purchaseOrder?.supplier_id || '',
      order_date: purchaseOrder?.order_date ? parseISO(purchaseOrder.order_date) : new Date(),
      expected_delivery: purchaseOrder?.expected_delivery ? parseISO(purchaseOrder.expected_delivery) : new Date(),
      notes: purchaseOrder?.notes || '',
      status: purchaseOrder?.status || 'draft',
    },
  });

  const onSubmit = (values: PurchaseOrderFormValues) => {
    if (!values.order_date || !isValid(values.order_date)) {
      toast({
        title: "Erro",
        description: 'Data do pedido inválida.',
        variant: "destructive"
      });
      return;
    }

    if (!values.expected_delivery || !isValid(values.expected_delivery)) {
      toast({
        title: "Erro",
        description: 'Data de entrega esperada inválida.',
        variant: "destructive"
      });
      return;
    }

    const supplierName = getSupplierNameById(values.supplier_id);

    const purchaseOrderData: PurchaseOrder = {
      id: purchaseOrder?.id || '',
      supplier_id: values.supplier_id,
      supplier_name: supplierName,
      status: values.status,
      order_date: format(values.order_date, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''),
      expected_delivery: format(values.expected_delivery, 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\''),
      total: items.reduce((acc, item) => acc + item.total, 0),
      notes: values.notes,
      created_at: purchaseOrder?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: items,
    };

    onSave(purchaseOrderData);
    onClose();
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        purchase_order_id: purchaseOrder?.id || '',
        product_id: '',
        product_name: '',
        quantity_ordered: 1,
        quantity_received: 0,
        unit_price: 0,
        total: 0,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleItemChange = (id: string, field: string, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item };
          switch (field) {
            case 'product_id':
              updatedItem.product_id = value as string;
              break;
            case 'product_name':
              updatedItem.product_name = value as string;
              break;
            case 'quantity_ordered':
              updatedItem.quantity_ordered = Number(value);
              break;
            case 'unit_price':
              updatedItem.unit_price = Number(value);
              break;
          }
          updatedItem.total = updatedItem.quantity_ordered * updatedItem.unit_price;
          return updatedItem;
        }
        return item;
      })
    );
  };

  // Get supplier name by ID
  const getSupplierNameById = (id: string): string => {
    const supplier = suppliers.find(s => s.id === id);
    return supplier ? supplier.name : 'Desconhecido';
  };

  // Function to handle new supplier creation
  const handleAddNewSupplier = async (supplierData: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newSupplier = await addSupplier(supplierData);
      
      // Update form with the new supplier
      form.setValue('supplier_id', newSupplier.id);
      
      // Show success message
      toast({
        title: "Sucesso",
        description: `Fornecedor ${newSupplier.name} adicionado com sucesso.`,
      });
      
      // Close the supplier form modal
      setIsSupplierFormOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao adicionar fornecedor.",
        variant: "destructive"
      });
    }
  };

  // Form JSX
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {purchaseOrder ? 'Editar Ordem de Compra' : 'Nova Ordem de Compra'}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="supplier_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fornecedor</FormLabel>
                      <div className="flex space-x-2">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecionar fornecedor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {suppliers.length > 0 ? (
                              suppliers.map((supplier) => (
                                <SelectItem key={supplier.id} value={supplier.id}>
                                  {supplier.name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="" disabled>
                                Nenhum fornecedor cadastrado
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={() => setIsSupplierFormOpen(true)}
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Rascunho</SelectItem>
                          <SelectItem value="submitted">Enviado</SelectItem>
                          <SelectItem value="received">Recebido</SelectItem>
                          <SelectItem value="cancelled">Cancelado</SelectItem>
                          <SelectItem value="sent">Enviado</SelectItem>
                          <SelectItem value="partial">Parcial</SelectItem>
                          <SelectItem value="complete">Completo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="order_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data do Pedido</FormLabel>
                      <DatePicker
                        onSelect={field.onChange}
                        defaultValue={field.value}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expected_delivery"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Entrega Esperada</FormLabel>
                      <DatePicker
                        onSelect={field.onChange}
                        defaultValue={field.value}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Notas adicionais"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold">Items</h4>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Item
                  </Button>
                </div>
                {items.map((item) => (
                  <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-2">
                    <Input
                      type="text"
                      placeholder="ID do Produto"
                      value={item.product_id}
                      onChange={(e) => handleItemChange(item.id, 'product_id', e.target.value)}
                    />
                    <Input
                      type="text"
                      placeholder="Nome do Produto"
                      value={item.product_name}
                      onChange={(e) => handleItemChange(item.id, 'product_name', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Quantidade"
                      value={item.quantity_ordered}
                      onChange={(e) => handleItemChange(item.id, 'quantity_ordered', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Preço Unitário"
                      value={item.unit_price}
                      onChange={(e) => handleItemChange(item.id, 'unit_price', e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Remover
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {purchaseOrder ? 'Salvar' : 'Criar'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Supplier Form Modal */}
      <SupplierFormModal
        isOpen={isSupplierFormOpen}
        onClose={() => setIsSupplierFormOpen(false)}
        onSave={handleAddNewSupplier}
        supplier={null}
      />
    </>
  );
};

export default PurchaseOrderFormModal;
