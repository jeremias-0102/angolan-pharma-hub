
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Pill, ClipboardList, AlertCircle, CheckCircle } from 'lucide-react';

// Mock data for prescriptions
const mockPrescriptions = [
  {
    id: '1',
    orderNumber: 'ORD-2025-0123',
    customer: 'Ana Silva',
    date: '2025-05-10',
    items: ['Amoxicilina 500mg', 'Dipirona 1g'],
    status: 'pending'
  },
  {
    id: '2',
    orderNumber: 'ORD-2025-0124',
    customer: 'Carlos Mendes',
    date: '2025-05-11',
    items: ['Losartana 50mg', 'Atenolol 25mg'],
    status: 'approved'
  },
  {
    id: '3',
    orderNumber: 'ORD-2025-0125',
    customer: 'Maria Sousa',
    date: '2025-05-12',
    items: ['Fluoxetina 20mg'],
    status: 'approved'
  },
  {
    id: '4',
    orderNumber: 'ORD-2025-0126',
    customer: 'João Pereira',
    date: '2025-05-13',
    items: ['Rivotril 2mg', 'Zolpidem 10mg'],
    status: 'rejected'
  },
  {
    id: '5',
    orderNumber: 'ORD-2025-0127',
    customer: 'Luísa Costa',
    date: '2025-05-14',
    items: ['Insulina Lantus', 'Metformina 850mg'],
    status: 'pending'
  },
];

// Mock data for inventory alerts
const mockInventoryAlerts = [
  {
    id: '1',
    product: 'Amoxicilina 500mg',
    quantity: 50,
    threshold: 100,
    type: 'low_stock'
  },
  {
    id: '2',
    product: 'Dipirona 500mg',
    quantity: 20,
    threshold: 50,
    type: 'low_stock'
  },
  {
    id: '3',
    product: 'Losartana 50mg',
    expiryDate: '2025-06-30',
    type: 'expiration'
  },
  {
    id: '4',
    product: 'Vitamina C 1g',
    expiryDate: '2025-07-15',
    type: 'expiration'
  },
];

const PharmacistDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter prescriptions based on search and active tab
  const filteredPrescriptions = mockPrescriptions.filter(prescription => {
    const matchesSearch = 
      prescription.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.customer.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && prescription.status === activeTab;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Aprovado</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejeitado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Painel do Farmacêutico</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Prescrições Pendentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ClipboardList className="h-8 w-8 text-yellow-500 mr-2" />
                <span className="text-2xl font-bold">
                  {mockPrescriptions.filter(p => p.status === 'pending').length}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Alertas de Estoque</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-red-500 mr-2" />
                <span className="text-2xl font-bold">
                  {mockInventoryAlerts.filter(a => a.type === 'low_stock').length}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Prescrições Aprovadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
                <span className="text-2xl font-bold">
                  {mockPrescriptions.filter(p => p.status === 'approved').length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-lg">Prescrições</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      className="pl-8 w-full sm:w-[250px]"
                      placeholder="Pesquisar prescrições..."
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
                    <TabsTrigger value="approved">Aprovadas</TabsTrigger>
                    <TabsTrigger value="rejected">Rejeitadas</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value={activeTab}>
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Pedido</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPrescriptions.length > 0 ? (
                            filteredPrescriptions.map((prescription) => (
                              <TableRow key={prescription.id}>
                                <TableCell className="font-medium">{prescription.orderNumber}</TableCell>
                                <TableCell>{prescription.customer}</TableCell>
                                <TableCell>{formatDate(prescription.date)}</TableCell>
                                <TableCell>{getStatusBadge(prescription.status)}</TableCell>
                                <TableCell className="text-right">
                                  <Button variant="outline" size="sm">Ver</Button>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="h-24 text-center">
                                Nenhuma prescrição encontrada.
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
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Alertas de Inventário</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockInventoryAlerts.map((alert) => (
                    <div key={alert.id} className="border rounded-lg p-3">
                      <div className="flex items-start">
                        <div className={`rounded-full p-2 mr-3 ${alert.type === 'low_stock' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                          {alert.type === 'low_stock' ? (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          ) : (
                            <Pill className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{alert.product}</p>
                          {alert.type === 'low_stock' ? (
                            <p className="text-xs text-gray-500">
                              Estoque baixo: {alert.quantity}/{alert.threshold}
                            </p>
                          ) : (
                            <p className="text-xs text-gray-500">
                              Expira em: {formatDate(alert.expiryDate!)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PharmacistDashboard;
