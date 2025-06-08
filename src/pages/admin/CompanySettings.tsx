
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Building, Phone, Mail, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CompanySettings: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [companyData, setCompanyData] = useState({
    name: "BEGJNP Pharma",
    address: "Rua da Saúde, 123, Luanda, Angola",
    phone: "+244 923 456 789",
    email: "contato@begjnppharma.co.ao",
    website: "www.begjnppharma.co.ao",
    nif: "5432109876",
    description: "Farmácia moderna dedicada ao bem-estar e saúde da comunidade angolana."
  });

  const handleBack = () => {
    navigate('/admin');
  };

  const handleInputChange = (field: string, value: string) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Aqui você salvaria os dados da empresa
    console.log('Salvando dados da empresa:', companyData);
    toast({
      title: "Configurações salvas",
      description: "As configurações da empresa foram atualizadas com sucesso.",
    });
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={handleBack} className="mr-2">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Configurações da Empresa</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5" />
              Informações da Empresa
            </CardTitle>
            <CardDescription>
              Configure os dados básicos da sua farmácia
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome da Empresa</Label>
              <Input
                id="name"
                value={companyData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="nif">NIF</Label>
              <Input
                id="nif"
                value={companyData.nif}
                onChange={(e) => handleInputChange('nif', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={companyData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="mr-2 h-5 w-5" />
              Informações de Contato
            </CardTitle>
            <CardDescription>
              Configure os dados de contato da farmácia
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="phone" className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                Telefone
              </Label>
              <Input
                id="phone"
                value={companyData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={companyData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={companyData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="address" className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                Endereço
              </Label>
              <Textarea
                id="address"
                value={companyData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Configurações do Sistema</CardTitle>
          <CardDescription>
            Configure parâmetros gerais do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currency">Moeda Padrão</Label>
              <Input
                id="currency"
                value="AOA (Kwanza Angolano)"
                disabled
              />
            </div>
            
            <div>
              <Label htmlFor="timezone">Fuso Horário</Label>
              <Input
                id="timezone"
                value="Africa/Luanda"
                disabled
              />
            </div>
            
            <div>
              <Label htmlFor="language">Idioma</Label>
              <Input
                id="language"
                value="Português (Angola)"
                disabled
              />
            </div>
            
            <div>
              <Label htmlFor="tax_rate">Taxa de IVA (%)</Label>
              <Input
                id="tax_rate"
                value="14"
                type="number"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} className="bg-pharma-primary hover:bg-pharma-primary/90">
          <Save className="mr-2 h-4 w-4" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};

export default CompanySettings;
