import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { FileUpload } from "@/components/ui/file-upload";
import { companyInfo } from "@/data/mockData";
import { ArrowLeft, Save, Building, CreditCard, Bell, Shield, Map } from "lucide-react";

const CompanySettings = () => {
  const [companyName, setCompanyName] = useState(companyInfo.name);
  const [companyEmail, setCompanyEmail] = useState(companyInfo.email);
  const [companyPhone, setCompanyPhone] = useState(companyInfo.phone);
  const [companyAddress, setCompanyAddress] = useState(companyInfo.address);
  const [companyDescription, setCompanyDescription] = useState(companyInfo.description);
  const [paymentIntegrationEnabled, setPaymentIntegrationEnabled] = useState(companyInfo.paymentIntegrationEnabled);
  const [notificationsEnabled, setNotificationsEnabled] = useState(companyInfo.notificationsEnabled);
  const [securitySettingsEnabled, setSecuritySettingsEnabled] = useState(companyInfo.securitySettingsEnabled);
  const [logo, setLogo] = useState<File | null>(null);

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSaveSettings = () => {
    // Here you would typically send the updated settings to your backend
    toast({
      title: "Configurações Salvas",
      description: "As configurações da empresa foram atualizadas com sucesso.",
    });
  };

  const handleLogoUpload = (file: File) => {
    setLogo(file);
    toast({
      title: "Logo Atualizado",
      description: "O logo da empresa foi atualizado com sucesso.",
    });
  };

  const handleBack = () => {
    navigate('/admin');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Button variant="ghost" onClick={handleBack} className="mr-2">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Configurações da Empresa</h1>
      </div>

      <Tabs defaultValue="geral" className="space-y-4">
        <TabsList>
          <TabsTrigger value="geral"><Building className="mr-2 h-4 w-4" />Geral</TabsTrigger>
          <TabsTrigger value="pagamento"><CreditCard className="mr-2 h-4 w-4" />Pagamento</TabsTrigger>
          <TabsTrigger value="notificacoes"><Bell className="mr-2 h-4 w-4" />Notificações</TabsTrigger>
          <TabsTrigger value="seguranca"><Shield className="mr-2 h-4 w-4" />Segurança</TabsTrigger>
          <TabsTrigger value="localizacao"><Map className="mr-2 h-4 w-4" />Localização</TabsTrigger>
        </TabsList>
        <TabsContent value="geral" className="space-y-2">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
              <CardDescription>Detalhes básicos sobre sua empresa.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome da Empresa</Label>
                <Input type="text" id="name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input type="tel" id="phone" value={companyPhone} onChange={(e) => setCompanyPhone(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Endereço</Label>
                <Input type="text" id="address" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" value={companyDescription} onChange={(e) => setCompanyDescription(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="logo">Logo da Empresa</Label>
                <FileUpload onUpload={handleLogoUpload} />
                {logo && (
                  <div className="mt-2">
                    <img
                      src={URL.createObjectURL(logo)}
                      alt="Company Logo"
                      className="max-h-20 rounded-md"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pagamento" className="space-y-2">
          <Card>
            <CardHeader>
              <CardTitle>Integração de Pagamento</CardTitle>
              <CardDescription>Gerencie as configurações de integração de pagamento.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Label htmlFor="paymentIntegration">Ativar Integração de Pagamento</Label>
                <Switch
                  id="paymentIntegration"
                  checked={paymentIntegrationEnabled}
                  onCheckedChange={(checked) => setPaymentIntegrationEnabled(checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notificacoes" className="space-y-2">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificação</CardTitle>
              <CardDescription>Gerencie as configurações de notificação.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Label htmlFor="notifications">Ativar Notificações</Label>
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={(checked) => setNotificationsEnabled(checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="seguranca" className="space-y-2">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>Gerencie as configurações de segurança.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Label htmlFor="securitySettings">Ativar Segurança Avançada</Label>
                <Switch
                  id="securitySettings"
                  checked={securitySettingsEnabled}
                  onCheckedChange={(checked) => setSecuritySettingsEnabled(checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="localizacao" className="space-y-2">
             <Card>
                <CardHeader>
                  <CardTitle>Configurações de Localização</CardTitle>
                  <CardDescription>
                    Gerencie as configurações de localização da sua empresa.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Em breve, você poderá configurar a localização da sua empresa aqui.</p>
                </CardContent>
              </Card>
        </TabsContent>
      </Tabs>

      <Button onClick={handleSaveSettings}><Save className="mr-2 h-4 w-4" />Salvar Configurações</Button>
    </div>
  );
};

export default CompanySettings;
