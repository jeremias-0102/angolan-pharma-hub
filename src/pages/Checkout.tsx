import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Check, CreditCard, Truck, MapPin, Smartphone } from 'lucide-react';
import MapLocationPicker from '@/components/checkout/MapLocationPicker';
import PrescriptionUpload from '@/components/checkout/PrescriptionUpload';
import { sendWhatsAppReceipt } from '@/utils/whatsappService';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    district: '',
    city: 'Luanda',
    notes: '',
    paymentMethod: 'multicaixa',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    multicaixaPhone: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [hasPrescription, setHasPrescription] = useState(false);
  const [prescriptionFiles, setPrescriptionFiles] = useState<File[]>([]);
  
  // Check if any items require prescription
  const requiresPrescription = items.some(item => item.product.needsPrescription);
  
  // Format price to Angolan Kwanza
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePaymentChange = (value: string) => {
    setFormData(prev => ({ ...prev, paymentMethod: value }));
  };
  
  const handlePrescriptionUpload = (files: File[]) => {
    setPrescriptionFiles(files);
    setHasPrescription(files.length > 0);
  };
  
  const handleLocationSelect = (coords: [number, number]) => {
    setLocation(coords);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (requiresPrescription && !hasPrescription) {
      toast({
        title: "Prescrição Necessária",
        description: "Por favor, carregue a prescrição médica para continuar.",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.paymentMethod === 'multicaixa' && !formData.multicaixaPhone) {
      toast({
        title: "Número de Telefone Necessário",
        description: "Por favor, insira o número de telefone para Multicaixa Express.",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.paymentMethod === 'card' && (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvv)) {
      toast({
        title: "Detalhes do Cartão Necessários",
        description: "Por favor, preencha todos os detalhes do cartão para continuar.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulando um pedido sendo criado
    const orderId = `PED${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    const orderDate = new Date().toLocaleString('pt-BR');
    
    // Preparar dados do pedido para o comprovante
    const orderDetails = {
      id: orderId,
      items: items,
      total: totalPrice,
      deliveryFee: deliveryFee,
      customerName: formData.name,
      customerPhone: formData.phone,
      date: orderDate,
      paymentMethod: getPaymentMethodName(formData.paymentMethod),
      address: `${formData.address}, ${formData.district}, ${formData.city}`
    };
    
    // Simulate order processing delay
    setTimeout(() => {
      toast({
        title: "Pedido Realizado com Sucesso!",
        description: "Seu pedido foi recebido e está em processamento.",
      });
      
      // Enviar comprovante via WhatsApp
      sendWhatsAppReceipt(orderDetails);
      
      clearCart();
      navigate('/');
      
      setIsSubmitting(false);
    }, 2000);
  };
  
  // Função auxiliar para obter o nome da forma de pagamento
  const getPaymentMethodName = (method: string): string => {
    switch (method) {
      case 'multicaixa':
        return 'Multicaixa Express';
      case 'card':
        return 'Cartão de Crédito/Débito';
      case 'cash':
        return 'Pagamento na Entrega';
      default:
        return method;
    }
  };
  
  // Calculate delivery fee based on cart total
  const deliveryFee = totalPrice > 10000 ? 0 : 1000;
  const finalTotal = totalPrice + deliveryFee;
  
  if (items.length === 0) {
    navigate('/carrinho');
    return null;
  }
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Finalizar Compra</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit}>
              {/* Prescription Upload if needed */}
              {requiresPrescription && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center text-pharma-primary">
                      <Check className="mr-2 h-5 w-5" />
                      Prescrição Médica
                    </CardTitle>
                    <CardDescription>
                      Alguns medicamentos em seu carrinho requerem prescrição médica
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PrescriptionUpload onFileUpload={handlePrescriptionUpload} />
                  </CardContent>
                </Card>
              )}
              
              {/* Delivery Information */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5 text-pharma-primary" />
                    Informações de Entrega
                  </CardTitle>
                  <CardDescription>Forneça detalhes para entrega do seu pedido</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        placeholder="+244 900 000 000"
                        required 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input 
                      id="address" 
                      name="address" 
                      value={formData.address} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="district">Bairro</Label>
                      <Input 
                        id="district" 
                        name="district" 
                        value={formData.district} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input 
                        id="city" 
                        name="city" 
                        value={formData.city} 
                        onChange={handleChange} 
                        required 
                      />
                    </div>
                  </div>
                  
                  {/* Map Location Picker */}
                  <div className="space-y-2">
                    <Label>Selecione sua localização no mapa</Label>
                    <MapLocationPicker onLocationSelect={handleLocationSelect} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Observações (opcional)</Label>
                    <Textarea 
                      id="notes" 
                      name="notes" 
                      value={formData.notes} 
                      onChange={handleChange} 
                      placeholder="Instruções especiais para entrega..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Payment Method */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5 text-pharma-primary" />
                    Método de Pagamento
                  </CardTitle>
                  <CardDescription>Escolha como deseja pagar pelo seu pedido</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup 
                    value={formData.paymentMethod} 
                    onValueChange={handlePaymentChange}
                    className="space-y-4"
                  >
                    {/* Multicaixa Express */}
                    <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="multicaixa" id="multicaixa" />
                      <Label htmlFor="multicaixa" className="cursor-pointer flex items-center">
                        <Smartphone className="mr-2 h-5 w-5" />
                        <div>
                          <div>Multicaixa Express</div>
                          <div className="text-sm text-gray-500">Pagamento automático pelo número de telefone</div>
                        </div>
                      </Label>
                    </div>
                    
                    {/* Credit/Debit Card */}
                    <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="cursor-pointer flex items-center">
                        <CreditCard className="mr-2 h-5 w-5" />
                        <div>
                          <div>Cartão de Crédito/Débito</div>
                          <div className="text-sm text-gray-500">Pagamento online seguro</div>
                        </div>
                      </Label>
                    </div>
                    
                    {/* Cash on Delivery */}
                    <div className="flex items-center space-x-2 border rounded-md p-4 cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash" className="cursor-pointer flex items-center">
                        <Truck className="mr-2 h-5 w-5" />
                        <div>
                          <div>Pagamento na Entrega</div>
                          <div className="text-sm text-gray-500">Pague em dinheiro quando receber</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  {/* Additional fields for Multicaixa Express */}
                  {formData.paymentMethod === 'multicaixa' && (
                    <div className="mt-4 p-4 border rounded-md bg-gray-50">
                      <Label htmlFor="multicaixaPhone" className="text-sm font-medium">Número de telefone Multicaixa Express</Label>
                      <div className="mt-2">
                        <Input
                          id="multicaixaPhone"
                          name="multicaixaPhone"
                          value={formData.multicaixaPhone}
                          onChange={handleChange}
                          placeholder="Ex: 926 000 000"
                          className="bg-white"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Será feito um desconto automático neste número de telefone associado ao seu Multicaixa Express.
                      </p>
                    </div>
                  )}
                  
                  {/* Additional fields for Card */}
                  {formData.paymentMethod === 'card' && (
                    <div className="mt-4 p-4 border rounded-md bg-gray-50">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber" className="text-sm font-medium">Número do Cartão</Label>
                          <Input
                            id="cardNumber"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleChange}
                            placeholder="0000 0000 0000 0000"
                            className="mt-1 bg-white"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="cardExpiry" className="text-sm font-medium">Data de Expiração</Label>
                            <Input
                              id="cardExpiry"
                              name="cardExpiry"
                              value={formData.cardExpiry}
                              onChange={handleChange}
                              placeholder="MM/AA"
                              className="mt-1 bg-white"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="cardCvv" className="text-sm font-medium">CVV</Label>
                            <Input
                              id="cardCvv"
                              name="cardCvv"
                              value={formData.cardCvv}
                              onChange={handleChange}
                              placeholder="123"
                              className="mt-1 bg-white"
                              maxLength={4}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="lg:hidden">
                <OrderSummary 
                  items={items} 
                  totalPrice={totalPrice} 
                  deliveryFee={deliveryFee} 
                  finalTotal={finalTotal} 
                  formatPrice={formatPrice}
                  isSubmitting={isSubmitting}
                />
              </div>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-4 hidden lg:block">
            <OrderSummary 
              items={items} 
              totalPrice={totalPrice} 
              deliveryFee={deliveryFee} 
              finalTotal={finalTotal} 
              formatPrice={formatPrice}
              isSubmitting={isSubmitting}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

interface OrderSummaryProps {
  items: any[];
  totalPrice: number;
  deliveryFee: number;
  finalTotal: number;
  formatPrice: (price: number) => string;
  isSubmitting: boolean;
  onSubmit?: (e: React.FormEvent) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  items, 
  totalPrice, 
  deliveryFee, 
  finalTotal, 
  formatPrice,
  isSubmitting,
  onSubmit
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo do Pedido</CardTitle>
        <CardDescription>
          {items.length} {items.length === 1 ? 'item' : 'itens'} no seu carrinho
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Items */}
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.product.id} className="flex justify-between">
              <div className="flex items-start">
                <span className="text-sm font-medium mr-2">{item.quantity}x</span>
                <span className="text-sm">{item.product.name}</span>
              </div>
              <span className="text-sm font-medium">
                {formatPrice(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        
        <Separator />
        
        {/* Order Summary Calculation */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Subtotal</span>
            <span className="text-sm font-medium">{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Entrega</span>
            <span className="text-sm font-medium">
              {deliveryFee === 0 ? 'Grátis' : formatPrice(deliveryFee)}
            </span>
          </div>
        </div>
        
        <Separator />
        
        <div className="flex justify-between">
          <span className="font-medium">Total</span>
          <span className="font-bold text-lg">{formatPrice(finalTotal)}</span>
        </div>
        
        {deliveryFee === 0 && (
          <div className="flex items-center text-sm text-green-600 bg-green-50 p-2 rounded">
            <Check size={16} className="mr-1" />
            <span>Frete grátis aplicado</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full bg-pharma-primary hover:bg-pharma-primary/90" 
          onClick={onSubmit}
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Processando..." : "Concluir Pedido"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Checkout;
