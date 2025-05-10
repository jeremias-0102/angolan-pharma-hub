
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Download, FileText, BarChart2, ShoppingBag, ShoppingCart, Package, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import SalesReportChart from '@/components/reports/SalesReportChart';
import InventoryReportChart from '@/components/reports/InventoryReportChart';
import PurchasesReportChart from '@/components/reports/PurchasesReportChart';

const ReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });

  const handleDownloadReport = () => {
    // This would be implemented to generate and download the actual report
    alert('Download de relatório não implementado ainda');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <Button onClick={handleDownloadReport} variant="outline" className="flex items-center">
          <Download className="mr-2 h-4 w-4" />
          Download Relatório
        </Button>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Período do Relatório</CardTitle>
            <CardDescription>
              Selecione o período para visualizar os relatórios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="grid gap-2">
                <Label htmlFor="from">Data Inicial</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="from"
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        format(dateRange.from, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => date && setDateRange({ ...dateRange, from: date })}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="to">Data Final</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="to"
                      variant={"outline"}
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !dateRange.to && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.to ? (
                        format(dateRange.to, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                      ) : (
                        <span>Selecione uma data</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => date && setDateRange({ ...dateRange, to: date })}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-1 sm:grid-cols-4 h-auto">
          <TabsTrigger value="sales" className="flex items-center justify-center py-2">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Vendas
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center justify-center py-2">
            <Package className="mr-2 h-4 w-4" />
            Estoque
          </TabsTrigger>
          <TabsTrigger value="purchases" className="flex items-center justify-center py-2">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Compras
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="flex items-center justify-center py-2">
            <Truck className="mr-2 h-4 w-4" />
            Fornecedores
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Vendas
                </CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">AOA 854.900</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% em relação ao período anterior
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Número de Pedidos
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+138</div>
                <p className="text-xs text-muted-foreground">
                  +12% em relação ao período anterior
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ticket Médio
                </CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">AOA 6.194</div>
                <p className="text-xs text-muted-foreground">
                  +7% em relação ao período anterior
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Taxa de Conversão
                </CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42%</div>
                <p className="text-xs text-muted-foreground">
                  +3% em relação ao período anterior
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Visão Geral de Vendas</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px]">
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">Dados do gráfico de vendas serão exibidos aqui.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Top Produtos Vendidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Paracetamol 500mg', 'Ibuprofeno 600mg', 'Vitamina C', 'Dipirona 1g', 'Amoxicilina 500mg'].map((product, i) => (
                    <div key={product} className="flex items-center">
                      <div className="font-medium">{i + 1}. {product}</div>
                      <div className="ml-auto font-medium">{Math.floor(Math.random() * 100) + 20} un.</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Top Categorias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Analgésicos', 'Antibióticos', 'Vitaminas', 'Antialérgicos', 'Anti-inflamatórios'].map((category, i) => (
                    <div key={category} className="flex items-center">
                      <div className="font-medium">{i + 1}. {category}</div>
                      <div className="ml-auto font-medium">AOA {(Math.floor(Math.random() * 100) + 50) * 1000}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Produtos em Estoque
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">182</div>
                <p className="text-xs text-muted-foreground">
                  Produtos ativos no sistema
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Produtos com Estoque Baixo
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground">
                  Produtos abaixo do estoque mínimo
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Valor Total do Estoque
                </CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">AOA 1.945.000</div>
                <p className="text-xs text-muted-foreground">
                  Preço de custo total
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Distribuição de Estoque por Categoria</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px]">
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">Gráfico de distribuição de estoque será exibido aqui.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="purchases" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Compras
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">AOA 632.450</div>
                <p className="text-xs text-muted-foreground">
                  No período selecionado
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Número de Pedidos
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  Pedidos de compra realizados
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pedidos Pendentes
                </CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">
                  Aguardando entrega
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Histórico de Compras</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px]">
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">Gráfico de histórico de compras será exibido aqui.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="suppliers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Fornecedores
                </CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">
                  Fornecedores cadastrados
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Fornecedores Ativos
                </CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  Com pedidos no período
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Tempo Médio de Entrega
                </CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7 dias</div>
                <p className="text-xs text-muted-foreground">
                  Da emissão do pedido até a entrega
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Fornecedores por Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Distribuidora ABC', 'Pharma Supplies', 'MedImport', 'PharmaDistrib', 'GlobalPharm'].map((supplier, i) => (
                  <div key={supplier} className="flex items-center">
                    <div className="font-medium">{i + 1}. {supplier}</div>
                    <div className="ml-auto font-medium">AOA {(Math.floor(Math.random() * 100) + 50) * 1000}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
