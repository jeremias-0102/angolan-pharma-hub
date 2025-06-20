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
import { DatePicker } from "@/components/ui/date-picker";
import { PlusCircle, Trash } from "lucide-react";
import { PurchaseOrder, PurchaseOrderItem, PurchaseOrderStatus, Supplier } from '@/types/models';
import { format, parseISO, isValid } from 'date-fns';
import SupplierSelectionModal from './SupplierSelectionModal';
import SupplierSearchCombobox from './SupplierSearchCombobox';
import ProductSearchCombobox from './ProductSearchCombobox';

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
  status: z.enum(['pending', 'ordered', 'received', 'cancelled'] as const),
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
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);

  const form = useForm<PurchaseOrderFormValues>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      supplier_id: purchaseOrder?.supplier_id || '',
      order_date: purchaseOrder?.order_date ? parseISO(purchaseOrder.order_date) : new Date(),
      expected_delivery: purchaseOrder?.expected_delivery ? parseISO(purchaseOrder.expected_delivery) : new Date(),
      notes: purchaseOrder?.notes || '',
      status: purchaseOrder?.status || 'pending',
    },
  });

  const onSubmit = (values: PurchaseOrderFormValues) => {
    if (!values.order_date || !isValid(values.order_date)) {
      alert('Data do pedido inválida.');
      return;
    }

    if (!values.expected_delivery || !isValid(values.expected_delivery)) {
      alert('Data de entrega esperada inválida.');
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
      total: items.reduce((acc, item) => acc + item.total_cost, 0),
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
        unit_cost: 0,
        total_cost: 0,
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
            case 'unit_cost':
              updatedItem.unit_cost = Number(value);
              break;
          }
          updatedItem.total_cost = updatedItem.quantity_ordered * updatedItem.unit_cost;
          return updatedItem;
        }
        return item;
      })
    );
  };

  const handleProductSelect = (itemId: string, productId: string, productName: string) => {
    handleItemChange(itemId, 'product_id', productId);
    handleItemChange(itemId, 'product_name', productName);
  };

  const getSupplierNameById = (id: string): string => {
    const supplier = suppliers.find(s => s.id === id);
    return supplier ? supplier.name : 'Desconhecido';
  };

  const handleSupplierSelect = (supplier: Supplier) => {
    form.setValue('supplier_id', supplier.id);
  };

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
                      <FormControl>
                        <SupplierSearchCombobox
                          value={field.value}
                          onSelect={(supplierId, supplierName) => {
                            field.onChange(supplierId);
                          }}
                          onOpenModal={() => setIsSupplierModalOpen(true)}
                          suppliers={suppliers}
                          placeholder="Selecionar fornecedor"
                        />
                      </FormControl>
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
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="ordered">Pedido</SelectItem>
                          <SelectItem value="received">Recebido</SelectItem>
                          <SelectItem value="cancelled">Cancelado</SelectItem>
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
                    <ProductSearchCombobox
                      value={item.product_id}
                      onSelect={(productId, productName) => handleProductSelect(item.id, productId, productName)}
                      placeholder="Selecionar produto"
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
                      value={item.unit_cost}
                      onChange={(e) => handleItemChange(item.id, 'unit_cost', e.target.value)}
                    />
                    <Input
                      type="text"
                      placeholder="Total"
                      value={item.total_cost.toFixed(2)}
                      readOnly
                      className="bg-gray-100"
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

      <SupplierSelectionModal
        isOpen={isSupplierModalOpen}
        onClose={() => setIsSupplierModalOpen(false)}
        onSelect={handleSupplierSelect}
        suppliers={suppliers}
      />
    </>
  );
};

export default PurchaseOrderFormModal;
