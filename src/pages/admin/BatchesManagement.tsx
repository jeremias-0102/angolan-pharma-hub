
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Mock data until we have a proper API
const mockBatches = [
  {
    id: '1',
    number: 'LOT-2025-001',
    product: 'Paracetamol 500mg',
    quantity: 5000,
    manufacturingDate: '2025-01-15',
    expiryDate: '2026-01-15',
    status: 'active',
  },
  {
    id: '2',
    number: 'LOT-2025-002',
    product: 'Ibuprofeno 400mg',
    quantity: 3000,
    manufacturingDate: '2025-02-10',
    expiryDate: '2026-02-10',
    status: 'active',
  },
  {
    id: '3',
    number: 'LOT-2024-056',
    product: 'Amoxicilina 250mg',
    quantity: 1500,
    manufacturingDate: '2024-11-20',
    expiryDate: '2025-11-20',
    status: 'active',
  },
  {
    id: '4',
    number: 'LOT-2024-032',
    product: 'Dipirona 500mg',
    quantity: 0,
    manufacturingDate: '2024-10-05',
    expiryDate: '2025-10-05',
    status: 'depleted',
  },
  {
    id: '5',
    number: 'LOT-2023-089',
    product: 'Vitamina C 1g',
    quantity: 250,
    manufacturingDate: '2023-06-30',
    expiryDate: '2024-06-30',
    status: 'expired',
  },
];

const BatchesManagement = () => {
  const [batches, setBatches] = useState(mockBatches);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Filter batches based on search term
  const filteredBatches = batches.filter(batch => 
    batch.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Dados atualizados",
        description: "A lista de lotes foi atualizada com sucesso."
      });
    }, 800);
  };

  const getBatchStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Ativo</Badge>;
      case 'depleted':
        return <Badge className="bg-orange-500">Esgotado</Badge>;
      case 'expired':
        return <Badge className="bg-red-500">Expirado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestão de Lotes</h1>
          <Button onClick={handleRefresh} variant="outline" size="icon" disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Lotes de Produtos</CardTitle>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    className="pl-8"
                    placeholder="Pesquisar lotes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="h-4 w-4 mr-2" /> Novo Lote
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-right">Quantidade</TableHead>
                    <TableHead>Data Fabricação</TableHead>
                    <TableHead>Data Validade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBatches.length > 0 ? (
                    filteredBatches.map((batch) => (
                      <TableRow key={batch.id}>
                        <TableCell className="font-medium">{batch.number}</TableCell>
                        <TableCell>{batch.product}</TableCell>
                        <TableCell className="text-right">{batch.quantity}</TableCell>
                        <TableCell>{formatDate(batch.manufacturingDate)}</TableCell>
                        <TableCell>{formatDate(batch.expiryDate)}</TableCell>
                        <TableCell>{getBatchStatusBadge(batch.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Detalhes</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        Nenhum lote encontrado.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default BatchesManagement;
