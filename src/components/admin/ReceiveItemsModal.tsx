
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PurchaseOrder, PurchaseOrderItem } from '@/types/models';
import { Check, CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReceiveItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReceive: (orderId: string, receivedItems: any[]) => void;
  purchaseOrder: PurchaseOrder | null;
}

interface ReceivableItem extends PurchaseOrderItem {
  currentReceiving: number;
  batchNumber: string;
  expiryDate: Date | undefined;
}

const ReceiveItemsModal: React.FC<ReceiveItemsModalProps> = ({
  isOpen,
  onClose,
  onReceive,
  purchaseOrder
}) => {
  // Create a receivable items state that includes additional fields for receiving
  const [receivableItems, setReceivableItems] = useState<ReceivableItem[]>(
    purchaseOrder?.items.map(item => ({
      ...item,
      currentReceiving: 0,
      batchNumber: '',
      expiryDate: undefined
    })) || []
  );

  // Reset form when purchase order changes
  React.useEffect(() => {
    if (purchaseOrder) {
      setReceivableItems(
        purchaseOrder.items.map(item => ({
          ...item,
          currentReceiving: 0,
          batchNumber: '',
          expiryDate: undefined
        }))
      );
    }
  }, [purchaseOrder]);

  const handleInputChange = (index: number, field: keyof ReceivableItem, value: any) => {
    const updatedItems = [...receivableItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    setReceivableItems(updatedItems);
  };

  const handleSubmit = () => {
    if (!purchaseOrder) return;

    // Filter out items with no quantity to receive
    const itemsToReceive = receivableItems
      .filter(item => item.currentReceiving > 0 && item.batchNumber && item.expiryDate)
      .map(item => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.currentReceiving,
        batch_number: item.batchNumber,
        expiry_date: item.expiryDate?.toISOString(),
      }));

    if (itemsToReceive.length === 0) {
      return; // No items to receive
    }

    onReceive(purchaseOrder.id, itemsToReceive);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Calculate remaining quantity to receive
  const getRemainingQuantity = (item: PurchaseOrderItem) => {
    return item.quantity_ordered - item.quantity_received;
  };

  if (!purchaseOrder) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Receber Itens</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Ordem de Compra</Label>
              <p className="font-medium">{purchaseOrder.id.slice(0, 8)}</p>
            </div>
            <div>
              <Label>Fornecedor</Label>
              <p className="font-medium">{purchaseOrder.supplier_id}</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Itens para Recebimento</h3>

            {receivableItems.map((item, index) => (
              <div key={item.id} className="border rounded-md p-4 mb-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Produto</Label>
                    <p className="font-medium">{item.product_id}</p>
                  </div>
                  <div>
                    <Label>Preço Unitário</Label>
                    <p className="font-medium">{formatCurrency(item.unit_price)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Pedido</Label>
                    <p className="font-medium">{item.quantity_ordered}</p>
                  </div>
                  <div>
                    <Label>Já Recebido</Label>
                    <p className="font-medium">{item.quantity_received}</p>
                  </div>
                  <div>
                    <Label>Restante</Label>
                    <p className="font-medium">{getRemainingQuantity(item)}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label className="font-medium mb-2 block">Receber Itens</Label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`quantity-${index}`}>Quantidade a Receber</Label>
                      <Input
                        id={`quantity-${index}`}
                        type="number"
                        min="0"
                        max={getRemainingQuantity(item)}
                        value={item.currentReceiving}
                        onChange={(e) => handleInputChange(index, 'currentReceiving', parseInt(e.target.value) || 0)}
                        className="mt-1"
                        disabled={getRemainingQuantity(item) === 0}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`batch-${index}`}>Número do Lote</Label>
                      <Input
                        id={`batch-${index}`}
                        value={item.batchNumber}
                        onChange={(e) => handleInputChange(index, 'batchNumber', e.target.value)}
                        className="mt-1"
                        disabled={item.currentReceiving === 0}
                      />
                    </div>

                    <div>
                      <Label>Data de Validade</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id={`expiry-${index}`}
                            variant="outline"
                            className="w-full justify-start text-left font-normal mt-1"
                            disabled={item.currentReceiving === 0}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {item.expiryDate ? format(item.expiryDate, 'dd/MM/yyyy') : 'Selecione uma data'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={item.expiryDate}
                            onSelect={(date) => handleInputChange(index, 'expiryDate', date)}
                            disabled={(date) => date < new Date()}
                            locale={ptBR}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button 
            className="bg-pharma-primary hover:bg-pharma-primary/90 flex items-center" 
            onClick={handleSubmit}
            disabled={!receivableItems.some(item => item.currentReceiving > 0 && item.batchNumber && item.expiryDate)}
          >
            <Check className="mr-2 h-4 w-4" /> Confirmar Recebimento
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiveItemsModal;
