
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from '@/hooks/use-cart';
import { Separator } from "@/components/ui/separator";
import { generateUUID } from '@/lib/utils';
import { toast } from "@/components/ui/use-toast"
import { useUser } from '@/hooks/use-user';
import { getBase64 } from '@/lib/image-utils';
import { api } from '@/lib/api';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart, calculateTotal } = useCart();
  const user = useUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('multicaixa');
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [hasPrescriptionItems, setHasPrescriptionItems] = useState(false);

  useEffect(() => {
    // Check if there are prescription items in the cart
    const requiresPrescription = items.some(item => item.product.needsPrescription);
    setHasPrescriptionItems(requiresPrescription);
  }, [items]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setPrescriptionFile(file || null);
  };

  const handleSubmitOrder = async () => {
    if (!name || !email || !phone || !address || !city || !state || !zipCode) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    if (hasPrescriptionItems && !prescriptionFile) {
      toast({
        title: "Erro",
        description: "Por favor, adicione a receita médica.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create order object with all required fields
      const orderData = {
        user_id: user?.id || 'guest',
        status: 'pending' as OrderStatus,
        payment_method: paymentMethod,
        payment_status: 'pending',
        total: calculateTotal(),
        items: items.map(item => ({
          id: generateUUID(),
          product_id: item.product.id,
          product_name: item.product.name,
          product_image: item.product.image || '',
          quantity: item.quantity,
          unit_price: item.product.price_sale || item.product.price,
          total: (item.product.price_sale || item.product.price) * item.quantity
        })),
        shipping_address: `${address}, ${city}, ${state}, ${zipCode}`,
        shipping_details: {
          address,
          city,
          state,
          zipCode
        },
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        requires_prescription: hasPrescriptionItems,
        prescription_image: prescriptionFile ? await getBase64(prescriptionFile) : undefined,
        discount: 0 // Add the discount field with default value
      };

      const response = await api.post('/orders', orderData);

      if (response.status === 201) {
        toast({
          title: "Sucesso",
          description: "Encomenda submetida com sucesso!",
        });
        clearCart();
        navigate('/encomendas');
      } else {
        toast({
          title: "Erro",
          description: "Ocorreu um erro ao submeter a encomenda.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao submeter a encomenda.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription>Informações de Encomenda</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                placeholder="Nome Completo"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                placeholder="Telefone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                placeholder="Endereço"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                placeholder="Cidade"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">Província</Label>
              <Input
                id="state"
                placeholder="Província"
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">Código Postal</Label>
              <Input
                id="zipCode"
                placeholder="Código Postal"
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <Label>Método de Pagamento</Label>
            <RadioGroup defaultValue="multicaixa" className="flex">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="multicaixa" id="r1" />
                <Label htmlFor="r1">Multicaixa</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="transferencia" id="r2" />
                <Label htmlFor="r2">Transferência Bancária</Label>
              </div>
            </RadioGroup>
          </div>

          {hasPrescriptionItems && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="prescription">Receita Médica</Label>
                <Input
                  id="prescription"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {prescriptionFile && (
                  <p className="text-sm text-gray-500">
                    Ficheiro selecionado: {prescriptionFile.name}
                  </p>
                )}
              </div>
            </>
          )}

          <Separator />

          <Button onClick={handleSubmitOrder}>Submeter Encomenda</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Checkout;
