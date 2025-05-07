
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { mockOrders } from '@/data/mockData';
import { useToast } from '@/components/ui/use-toast';
import { User, Package, ShoppingBag, MapPin, Phone, Mail, Edit2 } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return <div>Redirecionando...</div>;
  }

  // Get user orders (for client role)
  const userOrders = user.role === 'client' ? mockOrders.filter(order => order.userId === user.id) : [];

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Perfil atualizado",
      description: "As informações do seu perfil foram atualizadas com sucesso.",
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-AO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Format price to Angolan Kwanza
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Format order status
  const getOrderStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs">Pendente</span>;
      case 'processing':
        return <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">Processando</span>;
      case 'shipped':
        return <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs">Enviado</span>;
      case 'delivered':
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">Entregue</span>;
      case 'cancelled':
        return <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs">Cancelado</span>;
      default:
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800 text-xs">{status}</span>;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Meu Perfil</h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="md:col-span-3">
            <Card>
              <CardHeader className="text-center">
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-gray-200 p-6 mb-4">
                    <User className="h-8 w-8 text-gray-500" />
                  </div>
                  <CardTitle>{user.name}</CardTitle>
                  <CardDescription className="capitalize">{user.role}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span>+244 923 456 789</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Luanda, Angola</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-pharma-primary">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-9">
            <Tabs defaultValue="pedidos">
              <TabsList className="mb-6 grid grid-cols-2 md:grid-cols-3">
                <TabsTrigger value="pedidos" className="flex items-center">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Meus Pedidos
                </TabsTrigger>
                <TabsTrigger value="info" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Informações Pessoais
                </TabsTrigger>
                <TabsTrigger value="enderecos" className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Endereços
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pedidos">
                <Card>
                  <CardHeader>
                    <CardTitle>Histórico de Pedidos</CardTitle>
                    <CardDescription>
                      Veja o status de seus pedidos recentes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {userOrders.length > 0 ? (
                      <div className="space-y-4">
                        {userOrders.map(order => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <div>
                                <span className="text-sm font-medium">Pedido #{order.id}</span>
                                <span className="text-xs text-gray-500 ml-2">
                                  {formatDate(order.createdAt)}
                                </span>
                              </div>
                              <div>
                                {getOrderStatusBadge(order.status)}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                              <div>
                                <span className="text-xs text-gray-500">Itens:</span>
                                <span className="text-sm ml-1">
                                  {order.items.reduce((total, item) => total + item.quantity, 0)}
                                </span>
                              </div>
                              <div>
                                <span className="text-xs text-gray-500">Total:</span>
                                <span className="text-sm font-medium ml-1">
                                  {formatPrice(order.totalAmount)}
                                </span>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500">
                              Endereço: {order.address}
                            </div>
                            <div className="mt-2">
                              <Button variant="outline" size="sm">
                                Ver Detalhes
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">
                          Você ainda não fez nenhum pedido.
                        </p>
                        <Button asChild className="mt-4 bg-pharma-primary">
                          <a href="/produtos">Fazer Compras</a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="info">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Pessoais</CardTitle>
                    <CardDescription>
                      Atualize seus dados cadastrais.
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleProfileUpdate}>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome Completo</Label>
                          <Input id="name" defaultValue={user.name} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" defaultValue={user.email} disabled />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Telefone</Label>
                          <Input id="phone" defaultValue="+244 923 456 789" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="birthday">Data de Nascimento</Label>
                          <Input id="birthday" type="date" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Alterar Senha</Label>
                        <Input id="password" type="password" placeholder="Digite sua nova senha" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="bg-pharma-primary">
                        Salvar Alterações
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              <TabsContent value="enderecos">
                <Card>
                  <CardHeader>
                    <CardTitle>Meus Endereços</CardTitle>
                    <CardDescription>
                      Gerencie seus endereços de entrega.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">Residência</h3>
                            <p className="text-gray-600 text-sm mt-1">
                              Rua dos Coqueiros, 123<br />
                              Bairro Miramar<br />
                              Luanda, Angola
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Telefone: +244 923 456 789
                            </p>
                          </div>
                          <div className="flex">
                            <Button variant="ghost" size="icon">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">Trabalho</h3>
                            <p className="text-gray-600 text-sm mt-1">
                              Avenida 4 de Fevereiro, 78<br />
                              Bairro Ingombota<br />
                              Luanda, Angola
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Telefone: +244 912 345 678
                            </p>
                          </div>
                          <div className="flex">
                            <Button variant="ghost" size="icon">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        Adicionar Novo Endereço
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
