
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChartContainer } from '@/components/ui/chart';
import { 
  ArrowLeft,
  Calculator, 
  BarChart3,
  FileBarChart,
  ReceiptText,
  Calendar as CalendarIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import ReportDownloadButtons from '@/components/reports/ReportDownloadButtons';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Mock data for financial reports
const balanceSheetData = {
  assets: {
    current: {
      cash: 12500000,
      accountsReceivable: 3450000,
      inventory: 8975000,
      prepaidExpenses: 875000
    },
    nonCurrent: {
      property: 15000000,
      equipment: 7500000,
      accumulatedDepreciation: -3250000
    }
  },
  liabilities: {
    current: {
      accountsPayable: 4350000,
      shortTermDebt: 1250000,
      currentTaxes: 1875000
    },
    nonCurrent: {
      longTermDebt: 8750000
    }
  },
  equity: {
    capital: 25000000,
    retainedEarnings: 6825000
  }
};

const incomeStatementData = {
  revenue: 45000000,
  costOfGoodsSold: 27000000,
  operatingExpenses: {
    salaries: 6750000,
    rent: 1800000,
    utilities: 900000,
    marketing: 1350000,
    other: 750000
  },
  otherIncome: 450000,
  taxes: 2100000
};

const paymentMethodsData = [
  { name: 'Multicaixa', value: 45 },
  { name: 'Cartão', value: 30 },
  { name: 'Dinheiro', value: 25 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const FinancialReportsPage = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    to: new Date(),
  });
  
  const formatDate = (date: Date | undefined) => {
    return date ? format(date, 'dd/MM/yyyy', { locale: ptBR }) : 'Data não selecionada';
  };

  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/admin');
  };

  // Calculate totals
  const totalCurrentAssets = balanceSheetData.assets.current.cash + 
    balanceSheetData.assets.current.accountsReceivable +
    balanceSheetData.assets.current.inventory +
    balanceSheetData.assets.current.prepaidExpenses;
    
  const totalNonCurrentAssets = balanceSheetData.assets.nonCurrent.property + 
    balanceSheetData.assets.nonCurrent.equipment +
    balanceSheetData.assets.nonCurrent.accumulatedDepreciation;
    
  const totalAssets = totalCurrentAssets + totalNonCurrentAssets;
    
  const totalCurrentLiabilities = balanceSheetData.liabilities.current.accountsPayable +
    balanceSheetData.liabilities.current.shortTermDebt +
    balanceSheetData.liabilities.current.currentTaxes;
    
  const totalNonCurrentLiabilities = balanceSheetData.liabilities.nonCurrent.longTermDebt;
    
  const totalLiabilities = totalCurrentLiabilities + totalNonCurrentLiabilities;
    
  const totalEquity = balanceSheetData.equity.capital + balanceSheetData.equity.retainedEarnings;
    
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;
  
  // Income Statement calculations
  const grossProfit = incomeStatementData.revenue - incomeStatementData.costOfGoodsSold;
  
  const totalOperatingExpenses = incomeStatementData.operatingExpenses.salaries +
    incomeStatementData.operatingExpenses.rent +
    incomeStatementData.operatingExpenses.utilities +
    incomeStatementData.operatingExpenses.marketing +
    incomeStatementData.operatingExpenses.other;
    
  const operatingIncome = grossProfit - totalOperatingExpenses;
  
  const incomeBeforeTaxes = operatingIncome + incomeStatementData.otherIncome;
  
  const netIncome = incomeBeforeTaxes - incomeStatementData.taxes;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <Button variant="ghost" onClick={handleBack} className="mr-2">
          <ArrowLeft className="h-5 w-5 mr-1" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Relatórios Financeiros</h1>
      </div>

      <Tabs defaultValue="balance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="balance">
            <FileBarChart className="mr-2 h-4 w-4" />
            Balanço Patrimonial
          </TabsTrigger>
          <TabsTrigger value="income">
            <Calculator className="mr-2 h-4 w-4" />
            Demonstração de Resultado
          </TabsTrigger>
          <TabsTrigger value="payment">
            <ReceiptText className="mr-2 h-4 w-4" />
            Métodos de Pagamento
          </TabsTrigger>
          <TabsTrigger value="saft">
            <BarChart3 className="mr-2 h-4 w-4" />
            Relatório SAFT-AO
          </TabsTrigger>
        </TabsList>

        {/* Balanço Patrimonial */}
        <TabsContent value="balance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Balanço Patrimonial</CardTitle>
              <CardDescription>
                Posição financeira da empresa no período selecionado.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center space-x-4">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span>Data de referência:</span>
                <DateRangePicker date={date} onDateChange={setDate} />
                <span>
                  {formatDate(date?.to)}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ativos */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-center">Ativos</h3>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Ativos Circulantes</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Caixa e Equivalentes</span>
                        <span>{formatCurrency(balanceSheetData.assets.current.cash)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Contas a Receber</span>
                        <span>{formatCurrency(balanceSheetData.assets.current.accountsReceivable)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estoque</span>
                        <span>{formatCurrency(balanceSheetData.assets.current.inventory)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Despesas Antecipadas</span>
                        <span>{formatCurrency(balanceSheetData.assets.current.prepaidExpenses)}</span>
                      </div>
                      <div className="flex justify-between font-medium pt-1 border-t">
                        <span>Total Ativos Circulantes</span>
                        <span>{formatCurrency(totalCurrentAssets)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Ativos Não Circulantes</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Imóveis</span>
                        <span>{formatCurrency(balanceSheetData.assets.nonCurrent.property)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Equipamentos</span>
                        <span>{formatCurrency(balanceSheetData.assets.nonCurrent.equipment)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Depreciação Acumulada</span>
                        <span>{formatCurrency(balanceSheetData.assets.nonCurrent.accumulatedDepreciation)}</span>
                      </div>
                      <div className="flex justify-between font-medium pt-1 border-t">
                        <span>Total Ativos Não Circulantes</span>
                        <span>{formatCurrency(totalNonCurrentAssets)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-lg font-bold pt-2 border-t-2">
                    <span>Total de Ativos</span>
                    <span>{formatCurrency(totalAssets)}</span>
                  </div>
                </div>
                
                {/* Passivos e Patrimônio Líquido */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-center">Passivos e Patrimônio Líquido</h3>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Passivos Circulantes</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Contas a Pagar</span>
                        <span>{formatCurrency(balanceSheetData.liabilities.current.accountsPayable)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dívidas de Curto Prazo</span>
                        <span>{formatCurrency(balanceSheetData.liabilities.current.shortTermDebt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Impostos a Pagar</span>
                        <span>{formatCurrency(balanceSheetData.liabilities.current.currentTaxes)}</span>
                      </div>
                      <div className="flex justify-between font-medium pt-1 border-t">
                        <span>Total Passivos Circulantes</span>
                        <span>{formatCurrency(totalCurrentLiabilities)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Passivos Não Circulantes</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Dívidas de Longo Prazo</span>
                        <span>{formatCurrency(balanceSheetData.liabilities.nonCurrent.longTermDebt)}</span>
                      </div>
                      <div className="flex justify-between font-medium pt-1 border-t">
                        <span>Total Passivos Não Circulantes</span>
                        <span>{formatCurrency(totalNonCurrentLiabilities)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between font-medium pt-1 border-t">
                    <span>Total Passivos</span>
                    <span>{formatCurrency(totalLiabilities)}</span>
                  </div>
                  
                  <div className="space-y-2 pt-2 border-t">
                    <h4 className="font-medium">Patrimônio Líquido</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Capital</span>
                        <span>{formatCurrency(balanceSheetData.equity.capital)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lucros Acumulados</span>
                        <span>{formatCurrency(balanceSheetData.equity.retainedEarnings)}</span>
                      </div>
                      <div className="flex justify-between font-medium pt-1 border-t">
                        <span>Total Patrimônio Líquido</span>
                        <span>{formatCurrency(totalEquity)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-lg font-bold pt-2 border-t-2">
                    <span>Total Passivos e Patrimônio Líquido</span>
                    <span>{formatCurrency(totalLiabilitiesAndEquity)}</span>
                  </div>
                </div>
              </div>

              <ReportDownloadButtons 
                title="Balanço Patrimonial" 
                data={[
                  { item: 'Total de Ativos', valor: totalAssets },
                  { item: 'Total de Passivos', valor: totalLiabilities },
                  { item: 'Patrimônio Líquido', valor: totalEquity }
                ]} 
                columns={[
                  { header: 'Item', accessor: 'item' },
                  { header: 'Valor (AOA)', accessor: 'valor' }
                ]} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Demonstração de Resultado */}
        <TabsContent value="income" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Demonstração de Resultado</CardTitle>
              <CardDescription>
                Desempenho financeiro da empresa para o período selecionado.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center space-x-4">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span>Período:</span>
                <DateRangePicker date={date} onDateChange={setDate} />
                <span>
                  {formatDate(date?.from)} - {formatDate(date?.to)}
                </span>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Receita</span>
                    <span>{formatCurrency(incomeStatementData.revenue)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Custo dos Produtos Vendidos</span>
                    <span>- {formatCurrency(incomeStatementData.costOfGoodsSold)}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-1 border-t">
                    <span>Lucro Bruto</span>
                    <span>{formatCurrency(grossProfit)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Despesas Operacionais</h4>
                  <div className="space-y-1">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Salários</span>
                      <span>- {formatCurrency(incomeStatementData.operatingExpenses.salaries)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Aluguel</span>
                      <span>- {formatCurrency(incomeStatementData.operatingExpenses.rent)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Utilidades</span>
                      <span>- {formatCurrency(incomeStatementData.operatingExpenses.utilities)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Marketing</span>
                      <span>- {formatCurrency(incomeStatementData.operatingExpenses.marketing)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Outros</span>
                      <span>- {formatCurrency(incomeStatementData.operatingExpenses.other)}</span>
                    </div>
                    <div className="flex justify-between font-medium pt-1 border-t">
                      <span>Total Despesas Operacionais</span>
                      <span>- {formatCurrency(totalOperatingExpenses)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between font-medium pt-1 border-t">
                  <span>Lucro Operacional</span>
                  <span>{formatCurrency(operatingIncome)}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Outras Receitas</span>
                    <span>{formatCurrency(incomeStatementData.otherIncome)}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-1">
                    <span>Lucro Antes dos Impostos</span>
                    <span>{formatCurrency(incomeBeforeTaxes)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Impostos</span>
                    <span>- {formatCurrency(incomeStatementData.taxes)}</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold pt-2 border-t-2">
                  <span>Lucro Líquido</span>
                  <span>{formatCurrency(netIncome)}</span>
                </div>
              </div>

              <ReportDownloadButtons 
                title="Demonstração de Resultado" 
                data={[
                  { item: 'Receita', valor: incomeStatementData.revenue },
                  { item: 'Lucro Bruto', valor: grossProfit },
                  { item: 'Lucro Operacional', valor: operatingIncome },
                  { item: 'Lucro Líquido', valor: netIncome }
                ]} 
                columns={[
                  { header: 'Item', accessor: 'item' },
                  { header: 'Valor (AOA)', accessor: 'valor' }
                ]} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Métodos de Pagamento */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatório de Métodos de Pagamento</CardTitle>
              <CardDescription>
                Análise dos métodos de pagamento utilizados pelos clientes.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center space-x-4">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span>Período:</span>
                <DateRangePicker date={date} onDateChange={setDate} />
                <span>
                  {formatDate(date?.from)} - {formatDate(date?.to)}
                </span>
              </div>

              <div className="w-full aspect-[16/9] md:aspect-[21/9] lg:aspect-[3/1] flex justify-center items-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentMethodsData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {paymentMethodsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {paymentMethodsData.map((method, idx) => (
                  <div key={method.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{method.name}</h4>
                      <span className="text-lg font-bold">{method.value}%</span>
                    </div>
                    <Progress value={method.value} className="h-2" 
                      style={{backgroundColor: '#f1f5f9'}} // light gray background
                      indicatorClassName={`bg-[${COLORS[idx % COLORS.length]}]`} />
                  </div>
                ))}
              </div>

              <ReportDownloadButtons 
                title="Relatório de Métodos de Pagamento" 
                data={paymentMethodsData.map(item => ({ 
                  metodo: item.name, 
                  percentagem: `${item.value}%`
                }))} 
                columns={[
                  { header: 'Método de Pagamento', accessor: 'metodo' },
                  { header: 'Percentagem', accessor: 'percentagem' }
                ]} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Relatório SAFT-AO */}
        <TabsContent value="saft" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatório SAFT-AO</CardTitle>
              <CardDescription>
                Geração do arquivo SAFT-AO para a Administração Geral Tributária (AGT).
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex items-center space-x-4 mb-4">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span>Período:</span>
                <DateRangePicker date={date} onDateChange={setDate} />
                <span>
                  {formatDate(date?.from)} - {formatDate(date?.to)}
                </span>
              </div>

              <div className="bg-muted/50 p-6 rounded-lg border border-border">
                <div className="space-y-4">
                  <h3 className="font-medium">Sobre o SAFT-AO</h3>
                  <p className="text-muted-foreground">
                    O SAFT-AO (Standard Audit File for Tax - Angola) é um formato de arquivo XML padronizado usado 
                    para exportar dados fiscais e contábeis para a Administração Geral Tributária (AGT) de Angola.
                  </p>
                  <p className="text-muted-foreground">
                    Este arquivo contém informações detalhadas sobre vendas, compras, inventário e outros dados 
                    contábeis relevantes para o período selecionado.
                  </p>
                </div>

                <div className="mt-6 grid gap-4">
                  <h3 className="font-medium">Configurações do Relatório</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Versão SAFT</label>
                      <Select defaultValue="1.01">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a versão" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1.01">Versão 1.01</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tipo de Arquivo</label>
                      <Select defaultValue="full">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">Arquivo Completo</SelectItem>
                          <SelectItem value="invoices">Apenas Faturas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <Button className="flex items-center bg-pharma-primary hover:bg-pharma-primary/90">
                  <FileBarChart className="h-4 w-4 mr-2" />
                  Gerar SAFT-AO
                </Button>
                <Button variant="outline">
                  Visualizar Último Relatório
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialReportsPage;
