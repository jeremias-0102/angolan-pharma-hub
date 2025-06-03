import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Package, Clock, CheckCircle2, MapPin, Phone } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Mock data for deliveries
const mockDeliveries = [
  {
    id: '1',
    orderNumber: 'ORD-2025-0123',
    customer: 'Ana Silva',
    address: 'Rua dos Coqueiros, 123, Miramar, Luanda',
    phone: '+244 926-654-321',
    date: '2025-05-14',
    status: 'pending'
  },
  {
    id: '2',
    orderNumber: 'ORD-2025-0124',
    customer: 'Carlos Mendes',
    address: 'Avenida 4 de Fevereiro, 78, Ingombota, Luanda',
    phone: '+244 926-123-456',
    date: '2025-05-14',
    status: 'in_transit'
  },
  {
    id: '3',
    orderNumber: 'ORD-2025-0125',
    customer: 'Maria Sousa',
    address: 'Rua Amílcar Cabral, 45, Maianga, Luanda',
    phone: '+244 926-789-012',
    date: '2025-05-13',
    status: 'delivered'
  },
  {
    id: '4',
    orderNumber: 'ORD-2025-0126',
    customer: 'João Pereira',
    address: 'Rua Comandante Gika, 167, Alvalade, Luanda',
    phone: '+244 926-345-678',
    date: '2025-05-13',
    status: 'delivered'
  },
  {
    id: '5',
    orderNumber: 'ORD-2025-0127',
    customer: 'Luísa Costa',
    address: 'Rua da Missão, 56, Sambizanga, Luanda',
    phone: '+244 926-901-234',
    date: '2025-05-12',
    status: 'delivered'
  },
];

const DeliveryDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  
  // Filter deliveries based on search and active tab
  const filteredDeliveries = mockDeliveries.filter(delivery => {
    const matchesSearch = 
      delivery.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.address.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && delivery.status === activeTab;
  });

  const handleStatusChange = (deliveryId: string, newStatus: string) => {
    // In a real application, this would update the status via an API call
    toast({
      title: "Status atualizado",
      description: `Pedido ${deliveryId} foi atualizado para ${getStatusLabel(newStatus)}.`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case 'in_transit':
        return <Badge className="bg-blue-500">Em Trânsito</Badge>;
      case 'delivered':
        return <Badge className="bg-green-500">Entregue</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'in_transit':
        return 'Em Trânsito';
      case 'delivered':
        return 'Entregue';
      default:
        return status;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Painel do Entregador</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Entregas Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Package className="h-8 w-8 text-yellow-500 mr-2" />
                <span className="text-2xl font-bold">
                  {mockDeliveries.filter(d => d.status === 'pending').length}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Em Trânsito</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-blue-500 mr-2" />
                <span className="text-2xl font-bold">
                  {mockDeliveries.filter(d => d.status === 'in_transit').length}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Entregas Concluídas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle2 className="h-8 w-8 text-green-500 mr-2" />
                <span className="text-2xl font-bold">
                  {mockDeliveries.filter(d => d.status === 'delivered').length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Entregas</CardTitle>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  className="pl-8 w-full sm:w-[250px]"
                  placeholder="Pesquisar entregas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="pending">Pendentes</TabsTrigger>
                <TabsTrigger value="in_transit">Em Trânsito</TabsTrigger>
                <TabsTrigger value="delivered">Entregues</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab}>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Pedido</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead className="hidden md:table-cell">Data</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDeliveries.length > 0 ? (
                        filteredDeliveries.map((delivery) => (
                          <TableRow key={delivery.id}>
                            <TableCell className="font-medium">{delivery.orderNumber}</TableCell>
                            <TableCell>{delivery.customer}</TableCell>
                            <TableCell className="hidden md:table-cell">{formatDate(delivery.date)}</TableCell>
                            <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  toast({
                                    title: "Detalhes da entrega",
                                    description: `Endereço: ${delivery.address} | Telefone: ${delivery.phone}`,
                                  });
                                }}
                              >
                                Detalhes
                              </Button>
                              
                              {delivery.status === 'pending' && (
                                <Button 
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleStatusChange(delivery.id, 'in_transit')}
                                >
                                  Iniciar
                                </Button>
                              )}
                              
                              {delivery.status === 'in_transit' && (
                                <Button 
                                  variant="default"
                                  size="sm"
                                  className="bg-green-500 hover:bg-green-600"
                                  onClick={() => handleStatusChange(delivery.id, 'delivered')}
                                >
                                  Concluir
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                            Nenhuma entrega encontrada.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default DeliveryDashboard;
