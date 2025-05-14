
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User, PackageOpen, MapPin, ShoppingBag, Key, LogOut } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
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

  const handleSaveProfile = () => {
    setLoading(true);
    
    // Simulação de atualização de perfil
    setTimeout(() => {
      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram atualizadas com sucesso.',
      });
      setLoading(false);
    }, 1000);
  };

  const handleChangePassword = () => {
    setLoading(true);
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: 'Erro',
        description: 'As senhas não coincidem. Por favor, tente novamente.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }
    
    // Simulação de alteração de senha
    setTimeout(() => {
      toast({
        title: 'Senha alterada',
        description: 'Sua senha foi alterada com sucesso.',
      });
      setFormData({
        ...formData,
        password: '',
        newPassword: '',
        confirmPassword: '',
      });
      setLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const recentOrders = [
    {
      id: '123456',
      date: '15/05/2025',
      status: 'Entregue',
      total: 'AOA 15.000,00'
    },
    {
      id: '123455',
      date: '28/04/2025',
      status: 'Entregue',
      total: 'AOA 8.750,00'
    },
    {
      id: '123454',
      date: '10/04/2025',
      status: 'Entregue',
      total: 'AOA 12.300,00'
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <Button variant="outline" onClick={handleLogout} className="flex items-center">
              <LogOut className="mr-2 h-4 w-4" />
              Sair da Conta
            </Button>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <TabsTrigger value="profile" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Meu Perfil
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center">
              <PackageOpen className="mr-2 h-4 w-4" />
              Meus Pedidos
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Key className="mr-2 h-4 w-4" />
              Segurança
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
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
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile} disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Endereço</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço Completo</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Rua, número, bairro, cidade, província"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveProfile} disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar Endereço'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pedidos Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <ShoppingBag className="h-10 w-10 text-pharma-primary p-2 bg-pharma-primary/10 rounded-full" />
                          <div>
                            <p className="font-medium">Pedido #{order.id}</p>
                            <p className="text-sm text-gray-500">{order.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{order.total}</p>
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <PackageOpen className="h-12 w-12 mx-auto text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">Nenhum pedido encontrado</h3>
                    <p className="text-gray-500 mt-1">Você ainda não realizou nenhum pedido.</p>
                    <Button className="mt-4" asChild>
                      <a href="/produtos">Comprar Agora</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Alterar Senha</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Senha Atual</Label>
                    <Input
                      id="current-password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova Senha</Label>
                    <Input
                      id="new-password"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleChangePassword} disabled={loading}>
                  {loading ? 'Alterando...' : 'Alterar Senha'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Profile;
