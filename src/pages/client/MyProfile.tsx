
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Save, Camera } from 'lucide-react';
import FileUpload from '@/components/ui/file-upload';

const MyProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    
    try {
      // Aqui você salvaria os dados do perfil
      console.log('Salvando perfil:', formData);
      
      // Se houver nova imagem, fazer upload
      if (avatarFile) {
        // Simular upload de avatar
        console.log('Uploading avatar:', avatarFile);
      }
      
      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram atualizadas com sucesso.',
      });
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o perfil.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <User className="h-8 w-8 text-pharma-primary" />
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={formData.avatar} />
                <AvatarFallback className="text-xl">
                  {formData.name?.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="w-full max-w-xs">
                <Label className="flex items-center mb-2">
                  <Camera className="mr-2 h-4 w-4" />
                  Foto do Perfil
                </Label>
                <FileUpload
                  onFileChange={handleAvatarChange}
                  initialPreview={formData.avatar}
                  accept="image/*"
                  maxSize={2}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="seu@email.com"
                  disabled
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+244 xxx xxx xxx"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Seu endereço completo"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={handleSaveProfile} 
                disabled={loading}
                className="bg-pharma-primary hover:bg-pharma-primary/90"
              >
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default MyProfile;
