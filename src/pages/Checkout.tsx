import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from '@/contexts/CartContext';
import { Separator } from "@/components/ui/separator";
import { generateUUID } from '@/lib/utils';
import { toast } from "@/hooks/use-toast"
import { useAuth } from '@/contexts/AuthContext';
import { OrderStatus } from '@/types/models';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { addOrder } from '@/services/orderService';
import { 
  CreditCard, 
  MapPin, 
  Phone, 
  User, 
  Mail, 
  FileText, 
  Truck, 
  CheckCircle,
  AlertCircle,
  Plus,
  Minus
} from 'lucide-react';

const PROVINCES = [
  'Luanda', 'Benguela', 'Huíla', 'Bié', 'Cabinda', 'Cuando Cubango',
  'Cuanza Norte', 'Cuanza Sul', 'Cunene', 'Huambo', 'Lunda Norte',
  'Lunda Sul', 'Malanje', 'Moxico', 'Namibe', 'Uíge', 'Zaire'
];

const PAYMENT_METHODS = [
  { id: 'multicaixa', name: 'Multicaixa Express', description: 'Pagamento instantâneo', icon: '💳' },
  { id: 'transferencia', name: 'Transferência Bancária', description: 'BAI, BFA, BIC, Millennium', icon: '🏦' },
  { id: 'unitel_money', name: 'Unitel Money', description: 'Pagamento móvel', icon: '📱' },
  { id: 'cash', name: 'Pagamento na Entrega', description: 'Apenas em Luanda', icon: '💵' }
];

const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart, updateQuantity, removeFromCart } = useCart();
  const { user } = useAuth();

  // Estados do formulário
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    province: '',
    zipCode: '',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('multicaixa');
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [hasPrescriptionItems, setHasPrescriptionItems] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Calcular total
  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const price = item.product.price_sale || item.product.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  // Verificar se há itens que precisam de receita
  useEffect(() => {
    const requiresPrescription = items.some(item => item.product.needsPrescription);
    setHasPrescriptionItems(Boolean(requiresPrescription));
  }, [items]);

  // Atualizar dados do formulário
  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Validação de etapas
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return items.length > 0;
      case 2:
        return !!(formData.name && formData.email && formData.phone && formData.address && formData.city && formData.province);
      case 3:
        return !!paymentMethod && (!hasPrescriptionItems || !!prescriptionFile);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else if (!validateStep(currentStep)) {
      toast({
        title: "Informações incompletas",
        description: "Por favor, preenche todos os campos obrigatórios.",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPrescriptionFile(file);
  };

  const handleSubmitOrder = async () => {
    if (!validateStep(3)) {
      toast({
        title: "Erro na validação",
        description: "Por favor, verifica todas as informações.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        user_id: user?.id || 'guest',
        status: 'pending' as OrderStatus,
        payment_method: paymentMethod,
        payment_status: 'pending',
        total: calculateTotal(),
        items: items.map(item => ({
          id: generateUUID(),
          order_id: '', // Will be set by the service
          product_id: item.product.id,
          product_name: item.product.name,
          product_image: item.product.image || '',
          quantity: item.quantity,
          unit_price: item.product.price_sale || item.product.price || 0,
          total: (item.product.price_sale || item.product.price || 0) * item.quantity
        })),
        shipping_address: `${formData.address}, ${formData.city}, ${formData.province}, ${formData.zipCode}`,
        shipping_details: {
          address: formData.address,
          city: formData.city,
          province: formData.province,
          zipCode: formData.zipCode
        },
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        requires_prescription: hasPrescriptionItems,
        discount: 0,
        notes: formData.notes
      };

      const newOrder = await addOrder(orderData);

      if (newOrder) {
        toast({
          title: "🎉 Encomenda confirmada!",
          description: "A tua encomenda foi submetida com sucesso. Vais receber uma confirmação por email.",
        });
        clearCart();
        navigate('/');
      } else {
        throw new Error('Erro ao criar encomenda');
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        title: "Erro ao processar encomenda",
        description: "Ocorreu um erro. Tenta novamente ou contacta o suporte.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render do carrinho (Etapa 1)
  const renderCartStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Revisão da Encomenda
        </CardTitle>
        <CardDescription>Confirma os produtos no teu carrinho</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">O teu carrinho está vazio</p>
            <Button onClick={() => navigate('/produtos')} className="mt-4">
              Ir às compras
            </Button>
          </div>
        ) : (
          <>
            {items.map((item) => (
              <div key={`${item.product.id}-${item.quantity}`} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <img 
                    src={item.product.image || '/placeholder.svg'} 
                    alt={item.product.name} 
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h4 className="font-medium">{item.product.name}</h4>
                    <p className="text-sm text-gray-600">{item.product.description}</p>
                    {item.product.needsPrescription && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        <FileText className="w-3 h-3 mr-1" />
                        Receita obrigatória
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <div className="ml-4 text-right">
                    <p className="font-semibold">{((item.product.price_sale || item.product.price || 0) * item.quantity).toLocaleString()} Kz</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remover
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            <Separator />
            
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span>{calculateTotal().toLocaleString()} Kz</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  // Render dos dados pessoais (Etapa 2)
  const renderPersonalDataStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          Dados Pessoais e Entrega
        </CardTitle>
        <CardDescription>Informa os teus dados para processamento da encomenda</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Nome Completo *
            </Label>
            <Input
              id="name"
              placeholder="Nome Completo"
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Telefone *
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+244 xxx xxx xxx"
              value={formData.phone}
              onChange={(e) => updateFormData('phone', e.target.value)}
              required
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Endereço de Entrega
          </h4>
          
          <div className="space-y-2">
            <Label htmlFor="address">Endereço Completo *</Label>
            <Input
              id="address"
              placeholder="Rua, número, bairro"
              value={formData.address}
              onChange={(e) => updateFormData('address', e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade/Município *</Label>
              <Input
                id="city"
                placeholder="Cidade"
                value={formData.city}
                onChange={(e) => updateFormData('city', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="province">Província *</Label>
              <Select value={formData.province} onValueChange={(value) => updateFormData('province', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona a província" />
                </SelectTrigger>
                <SelectContent>
                  {PROVINCES.map(province => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zipCode">Código Postal</Label>
              <Input
                id="zipCode"
                placeholder="Código postal"
                value={formData.zipCode}
                onChange={(e) => updateFormData('zipCode', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notas de Entrega (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Instruções especiais para a entrega..."
              value={formData.notes}
              onChange={(e) => updateFormData('notes', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Render do pagamento (Etapa 3)
  const renderPaymentStep = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-green-600" />
            Método de Pagamento
          </CardTitle>
          <CardDescription>Escolhe como queres pagar a tua encomenda</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
            {PAYMENT_METHODS.map(method => (
              <div key={method.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <RadioGroupItem value={method.id} id={method.id} />
                <div className="flex-1">
                  <Label htmlFor={method.id} className="flex items-center gap-3 cursor-pointer">
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <p className="font-medium">{method.name}</p>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                  </Label>
                </div>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {hasPrescriptionItems && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertCircle className="h-5 w-5" />
              Receita Médica Obrigatória
            </CardTitle>
            <CardDescription className="text-orange-700">
              A tua encomenda contém medicamentos que requerem receita médica
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="prescription">Carregar Receita (PDF ou Imagem) *</Label>
              <Input
                id="prescription"
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="border-orange-300"
                required
              />
              {prescriptionFile && (
                <p className="text-sm text-green-600 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Ficheiro: {prescriptionFile.name}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Resumo Final</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{calculateTotal().toLocaleString()} Kz</span>
          </div>
          <div className="flex justify-between">
            <span>Taxa de entrega:</span>
            <span className="text-green-600">Grátis</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span>{calculateTotal().toLocaleString()} Kz</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Finalizar Encomenda</h1>
        <div className="flex items-center space-x-8">
          {[1, 2, 3].map(step => (
            <div key={step} className={`flex items-center ${step <= currentStep ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step <= currentStep ? 'bg-green-600 text-white' : 'bg-gray-200'
              }`}>
                {step}
              </div>
              <span className="ml-2 text-sm">
                {step === 1 && 'Carrinho'}
                {step === 2 && 'Dados'}
                {step === 3 && 'Pagamento'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {currentStep === 1 && renderCartStep()}
        {currentStep === 2 && renderPersonalDataStep()}
        {currentStep === 3 && renderPaymentStep()}

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Voltar
          </Button>
          
          {currentStep < 3 ? (
            <Button onClick={nextStep} disabled={!validateStep(currentStep)}>
              Continuar
            </Button>
          ) : (
            <Button 
              onClick={handleSubmitOrder} 
              disabled={isSubmitting || !validateStep(3)}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processando...
                </>
              ) : (
                <>
                  <Truck className="h-4 w-4 mr-2" />
                  Confirmar Encomenda
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
