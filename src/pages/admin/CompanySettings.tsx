
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Save, Building, Mail, Phone, MapPin, Globe, ImageIcon, User } from 'lucide-react';
import FileUpload from '@/components/ui/file-upload';
import { getCompanySettings, updateCompanySettings } from '@/services/settingsService';

interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

interface NotificationSettings {
  stock_alerts: boolean;
  order_alerts: boolean;
  expiry_alerts: boolean;
}

interface CompanySettings {
  name: string;
  slogan: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  website: string;
  logo?: string;
  tax_id: string;
  social_media: SocialMedia;
  notification_settings: NotificationSettings;
}

const CompanySettings: React.FC = () => {
  const [settings, setSettings] = useState<CompanySettings>({
    name: 'BEGJNP Pharma',
    slogan: 'Sua saúde em boas mãos',
    description: 'Rede de farmácias com atendimento personalizado e produtos de qualidade.',
    email: 'contato@begjnppharma.co.ao',
    phone: '926962170',
    address: 'Avenida 4 de Fevereiro, 123',
    city: 'Luanda',
    province: 'Luanda',
    postal_code: '1000-001',
    website: 'www.begjnppharma.co.ao',
    tax_id: '5001293847',
    social_media: {
      facebook: 'facebook.com/begjnppharma',
      instagram: 'instagram.com/begjnppharma',
      twitter: '',
      linkedin: 'linkedin.com/company/begjnppharma'
    },
    notification_settings: {
      stock_alerts: true,
      order_alerts: true,
      expiry_alerts: true
    }
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Simulate loading the company settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getCompanySettings();
        if (data) {
          setSettings(data);
        }
      } catch (error) {
        console.error('Error loading company settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  const handleLogoUpload = (file: File | null) => {
    setLogoFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      
      if (parent === 'social_media') {
        setSettings(prev => ({
          ...prev,
          social_media: {
            ...prev.social_media,
            [child]: value
          }
        }));
      } else if (parent === 'notification_settings') {
        setSettings(prev => ({
          ...prev,
          notification_settings: {
            ...prev.notification_settings,
            [child]: value === 'true'
          }
        }));
      }
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    // Handle nested properties for checkboxes
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      
      if (parent === 'notification_settings') {
        setSettings(prev => ({
          ...prev,
          notification_settings: {
            ...prev.notification_settings,
            [child]: checked
          }
        }));
      }
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Process logo upload if a new file is selected
      let logoUrl = settings.logo;
      if (logoFile) {
        // This would handle uploading the logo and getting the URL
        logoUrl = '/company_logo.png'; // Placeholder for demo
      }

      // Update settings with the new logo URL
      const updatedSettings = {
        ...settings,
        logo: logoUrl
      };

      // Save the updated settings
      await updateCompanySettings(updatedSettings);
      
      toast({
        title: "Configurações salvas",
        description: "As configurações da empresa foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Error saving company settings:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar as configurações da empresa.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Configurações da Empresa</h1>
        <Button 
          onClick={handleSaveSettings}
          className="bg-pharma-primary hover:bg-pharma-primary/90"
          disabled={isLoading}
        >
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-1 sm:grid-cols-3 h-auto">
          <TabsTrigger value="general" className="flex items-center justify-center py-2">
            <Building className="mr-2 h-4 w-4" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center justify-center py-2">
            <Mail className="mr-2 h-4 w-4" />
            Contato
          </TabsTrigger>
          <TabsTrigger value="brand" className="flex items-center justify-center py-2">
            <ImageIcon className="mr-2 h-4 w-4" />
            Marca e Identidade
          </TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
              <CardDescription>
                Dados básicos da empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Empresa</Label>
                  <Input
                    id="name"
                    name="name"
                    value={settings.name}
                    onChange={handleInputChange}
                    placeholder="Nome da sua empresa"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tax_id">ID Fiscal (NIF)</Label>
                  <Input
                    id="tax_id"
                    name="tax_id"
                    value={settings.tax_id}
                    onChange={handleInputChange}
                    placeholder="Número de identificação fiscal"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slogan">Slogan</Label>
                <Input
                  id="slogan"
                  name="slogan"
                  value={settings.slogan}
                  onChange={handleInputChange}
                  placeholder="Slogan ou lema da empresa"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={settings.description}
                  onChange={handleInputChange}
                  placeholder="Breve descrição sobre sua empresa"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Contact Information */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Informações de Contato</CardTitle>
              <CardDescription>
                Detalhes de contato e localização
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      value={settings.email}
                      onChange={handleInputChange}
                      placeholder="email@exemplo.com"
                      type="email"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      name="phone"
                      value={settings.phone}
                      onChange={handleInputChange}
                      placeholder="+244 923 456 789"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="flex items-center">
                  <Globe className="mr-2 h-4 w-4 text-gray-400" />
                  <Input
                    id="website"
                    name="website"
                    value={settings.website}
                    onChange={handleInputChange}
                    placeholder="www.seusite.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <div className="flex items-start">
                  <MapPin className="mr-2 h-4 w-4 text-gray-400 mt-2" />
                  <Textarea
                    id="address"
                    name="address"
                    value={settings.address}
                    onChange={handleInputChange}
                    placeholder="Endereço completo"
                    rows={2}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    name="city"
                    value={settings.city}
                    onChange={handleInputChange}
                    placeholder="Cidade"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="province">Província</Label>
                  <Input
                    id="province"
                    name="province"
                    value={settings.province}
                    onChange={handleInputChange}
                    placeholder="Província"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="postal_code">Código Postal</Label>
                  <Input
                    id="postal_code"
                    name="postal_code"
                    value={settings.postal_code}
                    onChange={handleInputChange}
                    placeholder="Código Postal"
                  />
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Redes Sociais</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      name="social_media.facebook"
                      value={settings.social_media.facebook || ''}
                      onChange={handleInputChange}
                      placeholder="URL do Facebook"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      name="social_media.instagram"
                      value={settings.social_media.instagram || ''}
                      onChange={handleInputChange}
                      placeholder="URL do Instagram"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      name="social_media.twitter"
                      value={settings.social_media.twitter || ''}
                      onChange={handleInputChange}
                      placeholder="URL do Twitter"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <Input
                      id="linkedin"
                      name="social_media.linkedin"
                      value={settings.social_media.linkedin || ''}
                      onChange={handleInputChange}
                      placeholder="URL do LinkedIn"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Brand Settings */}
        <TabsContent value="brand">
          <Card>
            <CardHeader>
              <CardTitle>Marca e Identidade Visual</CardTitle>
              <CardDescription>
                Logo e identidade visual da empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Logo da Empresa</Label>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <FileUpload
                      onFileChange={handleLogoUpload}
                      initialPreview={settings.logo}
                      accept="image/*"
                      maxSize={2}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Formatos permitidos: JPG, PNG, SVG. Tamanho máximo: 2MB.
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center justify-center border rounded-lg p-6">
                    {settings.logo ? (
                      <img
                        src={settings.logo}
                        alt="Logo da Empresa"
                        className="max-h-40 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = '/placeholder.svg';
                        }}
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <Building className="mx-auto h-16 w-16 mb-2" />
                        <p>Nenhum logo definido</p>
                      </div>
                    )}
                    <p className="mt-4 text-sm font-medium">{settings.name}</p>
                    <p className="text-xs text-gray-500">{settings.slogan}</p>
                  </div>
                </div>
              </div>
              
              {/* Notification settings */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-3">Configurações de Notificações</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="stock_alerts"
                      name="notification_settings.stock_alerts"
                      checked={settings.notification_settings.stock_alerts}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-gray-300 text-pharma-primary focus:ring-pharma-primary"
                    />
                    <Label htmlFor="stock_alerts">Alertas de estoque baixo</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="order_alerts"
                      name="notification_settings.order_alerts"
                      checked={settings.notification_settings.order_alerts}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-gray-300 text-pharma-primary focus:ring-pharma-primary"
                    />
                    <Label htmlFor="order_alerts">Notificações de novos pedidos</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="expiry_alerts"
                      name="notification_settings.expiry_alerts"
                      checked={settings.notification_settings.expiry_alerts}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-gray-300 text-pharma-primary focus:ring-pharma-primary"
                    />
                    <Label htmlFor="expiry_alerts">Alertas de produtos próximos ao vencimento</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanySettings;
