import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PurchaseOrder, PurchaseOrderItem, Product, Supplier } from '@/types/models';
import { getAllProducts } from '@/services/productService';
import { getAllSuppliers } from '@/services/supplierService';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface PurchaseOrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (purchaseOrder: PurchaseOrder) => void;
  purchaseOrder: PurchaseOrder | null;
}

const PurchaseOrderFormModal: React.FC<PurchaseOrderFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  purchaseOrder
}) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState<Partial<PurchaseOrder>>({
    supplier_id: '',
    status: 'draft',
    notes: '',
    total: 0,
    items: []
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [suppliersData, productsData] = await Promise.all([
          getAllSuppliers(),
          getAllProducts()
        ]);
        setSuppliers(suppliersData);
        setProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os fornecedores ou produtos."
        });
        setLoading(false);
      }
    };

    loadData();

    // Initialize form with purchase order data if editing
    if (purchaseOrder) {
      setFormData({
        id: purchaseOrder.id,
        supplier_id: purchaseOrder.supplier_id,
        status: purchaseOrder.status,
        notes: purchaseOrder.notes,
        total: purchaseOrder.total,
        items: [...purchaseOrder.items],
        order_date: purchaseOrder.order_date,
        expected_delivery: purchaseOrder.expected_delivery,
        actual_delivery: purchaseOrder.actual_delivery,
        created_at: purchaseOrder.created_at,
        updated_at: new Date().toISOString()
      });
    } else {
      // Reset form for new purchase order
      setFormData({
        supplier_id: '',
        status: 'draft',
        notes: '',
        total: 0,
        items: []
      });
    }
  }, [purchaseOrder, isOpen, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addItem = () => {
    const newItem: PurchaseOrderItem = {
      id: uuidv4(),
      purchase_order_id: purchaseOrder?.id || '',
      product_id: '',
      product_name: '',
      quantity_ordered: 0,
      quantity_received: 0,
      unit_price: 0,
      total: 0
    };

    setFormData(prev => ({
      ...prev,
      items: [...(prev.items || []), newItem]
    }));
  };

  const updateItem = (index: number, field: keyof PurchaseOrderItem, value: any) => {
    const updatedItems = [...(formData.items || [])];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };

    // If product changed, update unit price and product name
    if (field === 'product_id') {
      const product = products.find(p => p.id === value);
      if (product) {
        updatedItems[index].unit_price = product.price_cost;
        updatedItems[index].product_name = product.name;
      }
    }

    // Recalculate item total
    updatedItems[index].total = updatedItems[index].quantity_ordered * updatedItems[index].unit_price;

    // Update form data with new items and recalculate total
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      total: updatedItems.reduce((sum, item) => sum + item.total, 0)
    }));
  };

  const removeItem = (index: number) => {
    const updatedItems = [...(formData.items || [])];
    updatedItems.splice(index, 1);

    setFormData(prev => ({
      ...prev,
      items: updatedItems,
      total: updatedItems.reduce((sum, item) => sum + item.total, 0)
    }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.supplier_id || !(formData.items && formData.items.length > 0)) {
      toast({
        variant: "destructive",
        title: "Dados incompletos",
        description: "Por favor, selecione um fornecedor e adicione pelo menos um item.",
      });
      return;
    }

    const now = new Date().toISOString();
    const today = now.split('T')[0] + 'T00:00:00Z';
    
    const purchaseOrderData: PurchaseOrder = {
      id: formData.id || uuidv4(),
      supplier_id: formData.supplier_id as string,
      supplier_name: suppliers.find(s => s.id === formData.supplier_id)?.name || '',
      status: formData.status as PurchaseOrderStatus,
      order_date: formData.order_date || today,
      expected_delivery: formData.expected_delivery || today,
      actual_delivery: formData.actual_delivery,
      notes: formData.notes,
      total: formData.total as number,
      items: formData.items as PurchaseOrderItem[],
      created_at: formData.created_at || now,
      updated_at: now
    };

    onSave(purchaseOrderData);
    toast({
      title: purchaseOrder ? "Ordem atualizada" : "Ordem criada",
      description: purchaseOrder ? "A ordem foi atualizada com sucesso." : "A ordem foi criada com sucesso.",
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Get product name by ID
  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Produto não encontrado';
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px]">
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin h-8 w-8 border-4 border-pharma-primary border-t-transparent rounded-full"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {purchaseOrder ? 'Editar Ordem de Compra' : 'Nova Ordem de Compra'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Supplier Selection */}
          <div className="space-y-2">
            <label htmlFor="supplier" className="text-sm font-medium">Fornecedor</label>
            <Select 
              value={formData.supplier_id} 
              onValueChange={(value) => handleSelectChange('supplier_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um fornecedor" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">Status</label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => handleSelectChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="sent">Enviado</SelectItem>
                <SelectItem value="partial">Parcial</SelectItem>
                <SelectItem value="complete">Completo</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">Observações</label>
            <Textarea 
              name="notes"
              value={formData.notes || ''}
              onChange={handleInputChange}
              placeholder="Observações sobre a ordem de compra"
              rows={2}
            />
          </div>

          {/* Items Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Itens</h3>
              <Button 
                type="button" 
                size="sm" 
                onClick={addItem}
                className="flex items-center bg-blue-500 hover:bg-blue-600"
              >
                <Plus className="mr-1 h-4 w-4" /> Adicionar Item
              </Button>
            </div>

            {formData.items && formData.items.length > 0 ? (
              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={index} className="border rounded-md p-4 space-y-4">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Item {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Product Selection */}
                      <div>
                        <label className="text-sm font-medium">Produto</label>
                        <Select 
                          value={item.product_id} 
                          onValueChange={(value) => updateItem(index, 'product_id', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um produto" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Quantity */}
                      <div>
                        <label className="text-sm font-medium">Quantidade</label>
                        <Input 
                          type="number"
                          min="1"
                          value={item.quantity_ordered || ''}
                          onChange={(e) => updateItem(index, 'quantity_ordered', parseInt(e.target.value) || 0)}
                        />
                      </div>

                      {/* Unit Price */}
                      <div>
                        <label className="text-sm font-medium">Preço Unitário</label>
                        <Input 
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unit_price || ''}
                          onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                        />
                      </div>

                      {/* Item Total (Read-only) */}
                      <div>
                        <label className="text-sm font-medium">Total</label>
                        <Input 
                          readOnly
                          value={formatCurrency(item.quantity_ordered * item.unit_price)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border rounded-md p-8 text-center text-gray-500">
                <p>Nenhum item adicionado. Clique em "Adicionar Item" para começar.</p>
              </div>
            )}
          </div>

          {/* Order Total */}
          <div className="flex justify-end items-center space-x-2 border-t pt-4">
            <span className="font-medium">Total da Ordem:</span>
            <span className="text-xl font-bold">{formatCurrency(formData.total || 0)}</span>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button 
            className="bg-blue-500 hover:bg-blue-600 text-white" 
            onClick={handleSubmit}
          >
            {purchaseOrder ? 'Salvar Alterações' : 'Criar Ordem'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseOrderFormModal;
