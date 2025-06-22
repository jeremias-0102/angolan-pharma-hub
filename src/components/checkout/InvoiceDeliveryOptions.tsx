
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Mail, MessageCircle, Download } from 'lucide-react';

interface InvoiceDeliveryOptionsProps {
  selectedOption: string;
  onOptionChange: (option: string) => void;
  customerEmail?: string;
  customerPhone?: string;
}

const InvoiceDeliveryOptions: React.FC<InvoiceDeliveryOptionsProps> = ({
  selectedOption,
  onOptionChange,
  customerEmail,
  customerPhone
}) => {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <Download className="h-5 w-5" />
          Como deseja receber a fatura?
        </CardTitle>
        <CardDescription className="text-green-700">
          Escolha como gostaria de receber a sua fatura em PDF
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedOption} onValueChange={onOptionChange} className="space-y-4">
          <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-white cursor-pointer">
            <RadioGroupItem value="download" id="download" />
            <Label htmlFor="download" className="flex items-center gap-3 cursor-pointer flex-1">
              <Download className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Download Automático</p>
                <p className="text-sm text-gray-600">A fatura será baixada automaticamente</p>
              </div>
            </Label>
          </div>

          {customerEmail && (
            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-white cursor-pointer">
              <RadioGroupItem value="email" id="email" />
              <Label htmlFor="email" className="flex items-center gap-3 cursor-pointer flex-1">
                <Mail className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium">Enviar por Email</p>
                  <p className="text-sm text-gray-600">Enviar para {customerEmail}</p>
                </div>
              </Label>
            </div>
          )}

          {customerPhone && (
            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-white cursor-pointer">
              <RadioGroupItem value="whatsapp" id="whatsapp" />
              <Label htmlFor="whatsapp" className="flex items-center gap-3 cursor-pointer flex-1">
                <MessageCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">Enviar via WhatsApp</p>
                  <p className="text-sm text-gray-600">Enviar para {customerPhone}</p>
                </div>
              </Label>
            </div>
          )}

          <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-white cursor-pointer">
            <RadioGroupItem value="both" id="both" />
            <Label htmlFor="both" className="flex items-center gap-3 cursor-pointer flex-1">
              <div className="flex space-x-1">
                <Mail className="h-4 w-4 text-red-600" />
                <MessageCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Email + WhatsApp</p>
                <p className="text-sm text-gray-600">Enviar pelos dois métodos</p>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default InvoiceDeliveryOptions;
