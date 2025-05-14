
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft,
  FileText,
  Download,
  FileCog,
  Calculator,
  BarChart3,
  FileBarChart,
  ReceiptText
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Skeleton } from '@/components/ui/skeleton';
import ReportDownloadButtons from '@/components/reports/ReportDownloadButtons';

// Componente para os dados do balanço
const BalancoPatrimonial = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ativo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Ativo Circulante</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Caixa</span>
                    <span>50.000,00 AOA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bancos</span>
                    <span>250.000,00 AOA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contas a Receber</span>
                    <span>120.000,00 AOA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estoques</span>
                    <span>380.000,00 AOA</span>
                  </div>
                </div>
                <div className="flex justify-between font-medium border-t pt-2 mt-2">
                  <span>Total Ativo Circulante</span>
                  <span>800.000,00 AOA</span>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium mb-2">Ativo Não Circulante</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Imobilizado</span>
                    <span>600.000,00 AOA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Depreciação Acumulada</span>
                    <span>-100.000,00 AOA</span>
                  </div>
                </div>
                <div className="flex justify-between font-medium border-t pt-2 mt-2">
                  <span>Total Ativo Não Circulante</span>
                  <span>500.000,00 AOA</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between font-bold pt-2">
                <span>TOTAL DO ATIVO</span>
                <span>1.300.000,00 AOA</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Passivo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Passivo Circulante</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Fornecedores</span>
                    <span>200.000,00 AOA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Empréstimos</span>
                    <span>100.000,00 AOA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Impostos a Pagar</span>
                    <span>50.000,00 AOA</span>
                  </div>
                </div>
                <div className="flex justify-between font-medium border-t pt-2 mt-2">
                  <span>Total Passivo Circulante</span>
                  <span>350.000,00 AOA</span>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium mb-2">Patrimônio Líquido</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>Capital Social</span>
                    <span>500.000,00 AOA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reservas de Lucro</span>
                    <span>250.000,00 AOA</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lucros Acumulados</span>
                    <span>200.000,00 AOA</span>
                  </div>
                </div>
                <div className="flex justify-between font-medium border-t pt-2 mt-2">
                  <span>Total Patrimônio Líquido</span>
                  <span>950.000,00 AOA</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between font-bold pt-2">
                <span>TOTAL DO PASSIVO E PL</span>
                <span>1.300.000,00 AOA</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Componente para os dados do balancete
const Balancete = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Balancete de Verificação</CardTitle>
          <CardDescription>
            Resumo dos saldos de todas as contas contábeis da farmácia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left font-medium">Conta</th>
                  <th className="py-3 px-4 text-right font-medium">Débito</th>
                  <th className="py-3 px-4 text-right font-medium">Crédito</th>
                  <th className="py-3 px-4 text-right font-medium">Saldo</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="py-3 px-4">1. Caixa</td>
                  <td className="py-3 px-4 text-right">50.000,00</td>
                  <td className="py-3 px-4 text-right">0,00</td>
                  <td className="py-3 px-4 text-right">50.000,00</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">2. Bancos</td>
                  <td className="py-3 px-4 text-right">250.000,00</td>
                  <td className="py-3 px-4 text-right">0,00</td>
                  <td className="py-3 px-4 text-right">250.000,00</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">3. Contas a Receber</td>
                  <td className="py-3 px-4 text-right">120.000,00</td>
                  <td className="py-3 px-4 text-right">0,00</td>
                  <td className="py-3 px-4 text-right">120.000,00</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">4. Estoques</td>
                  <td className="py-3 px-4 text-right">380.000,00</td>
                  <td className="py-3 px-4 text-right">0,00</td>
                  <td className="py-3 px-4 text-right">380.000,00</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">5. Imobilizado</td>
                  <td className="py-3 px-4 text-right">600.000,00</td>
                  <td className="py-3 px-4 text-right">0,00</td>
                  <td className="py-3 px-4 text-right">600.000,00</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">6. Depreciação Acumulada</td>
                  <td className="py-3 px-4 text-right">0,00</td>
                  <td className="py-3 px-4 text-right">100.000,00</td>
                  <td className="py-3 px-4 text-right">-100.000,00</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">7. Fornecedores</td>
                  <td className="py-3 px-4 text-right">0,00</td>
                  <td className="py-3 px-4 text-right">200.000,00</td>
                  <td className="py-3 px-4 text-right">-200.000,00</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">8. Empréstimos</td>
                  <td className="py-3 px-4 text-right">0,00</td>
                  <td className="py-3 px-4 text-right">100.000,00</td>
                  <td className="py-3 px-4 text-right">-100.000,00</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">9. Impostos a Pagar</td>
                  <td className="py-3 px-4 text-right">0,00</td>
                  <td className="py-3 px-4 text-right">50.000,00</td>
                  <td className="py-3 px-4 text-right">-50.000,00</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">10. Capital Social</td>
                  <td className="py-3 px-4 text-right">0,00</td>
                  <td className="py-3 px-4 text-right">500.000,00</td>
                  <td className="py-3 px-4 text-right">-500.000,00</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">11. Reservas</td>
                  <td className="py-3 px-4 text-right">0,00</td>
                  <td className="py-3 px-4 text-right">250.000,00</td>
                  <td className="py-3 px-4 text-right">-250.000,00</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">12. Lucros Acumulados</td>
                  <td className="py-3 px-4 text-right">0,00</td>
                  <td className="py-3 px-4 text-right">200.000,00</td>
                  <td className="py-3 px-4 text-right">-200.000,00</td>
                </tr>
              </tbody>
              <tfoot className="bg-gray-100">
                <tr className="font-medium">
                  <td className="py-3 px-4">Totais</td>
                  <td className="py-3 px-4 text-right">1.400.000,00</td>
                  <td className="py-3 px-4 text-right">1.400.000,00</td>
                  <td className="py-3 px-4 text-right">0,00</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto" variant="outline">
            <Download className="h-4 w-4 mr-1" /> Exportar Balancete
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

// Componente para DRE
const DemonstraçãoResultado = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Demonstração do Resultado (DRE)</CardTitle>
          <CardDescription>
            Período: 01/01/2025 - 31/03/2025 (1° Trimestre)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Receita Bruta</span>
                <span>500.000,00 AOA</span>
              </div>
              <div className="flex justify-between pl-4 text-gray-600">
                <span>(-) Impostos sobre vendas</span>
                <span>-45.000,00 AOA</span>
              </div>
              <div className="flex justify-between mt-2 font-medium">
                <span>Receita Líquida</span>
                <span>455.000,00 AOA</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between mb-2 text-gray-600">
                <span>(-) Custo dos Produtos Vendidos</span>
                <span>-250.000,00 AOA</span>
              </div>
              <div className="flex justify-between mt-2 font-medium">
                <span>Lucro Bruto</span>
                <span>205.000,00 AOA</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="mb-2 font-medium">Despesas Operacionais</div>
              <div className="flex justify-between pl-4 text-gray-600">
                <span>(-) Despesas com Pessoal</span>
                <span>-80.000,00 AOA</span>
              </div>
              <div className="flex justify-between pl-4 text-gray-600">
                <span>(-) Despesas com Vendas</span>
                <span>-25.000,00 AOA</span>
              </div>
              <div className="flex justify-between pl-4 text-gray-600">
                <span>(-) Despesas Administrativas</span>
                <span>-30.000,00 AOA</span>
              </div>
              <div className="flex justify-between pl-4 text-gray-600">
                <span>(-) Despesas Financeiras</span>
                <span>-10.000,00 AOA</span>
              </div>
              <div className="flex justify-between mt-2 font-medium">
                <span>Total de Despesas Operacionais</span>
                <span>-145.000,00 AOA</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between font-medium">
                <span>Lucro Antes dos Impostos</span>
                <span>60.000,00 AOA</span>
              </div>
              <div className="flex justify-between pl-4 text-gray-600">
                <span>(-) Imposto de Renda</span>
                <span>-9.000,00 AOA</span>
              </div>
              <div className="flex justify-between pl-4 text-gray-600">
                <span>(-) Contribuição Social</span>
                <span>-5.400,00 AOA</span>
              </div>
            </div>
            
            <div className="bg-pharma-primary/10 p-4 rounded-md">
              <div className="flex justify-between font-bold text-lg">
                <span>Lucro Líquido do Período</span>
                <span>45.600,00 AOA</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="ml-auto" variant="outline">
            <Download className="h-4 w-4 mr-1" /> Exportar DRE
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

// Componente para SAFT
const SAFTReport = () => {
  const [month, setMonth] = useState<string>("3");
  const [year, setYear] = useState<string>("2025");
  
  const generateSAFT = () => {
    alert(`Gerando SAFT para ${month}/${year}`);
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>SAFT-AO (Standard Audit File for Tax - Angola)</CardTitle>
          <CardDescription>
            Arquivo padrão de auditoria fiscal para a Administração Geral Tributária (AGT)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    O arquivo SAFT-AO contém informações fiscais detalhadas e deve ser enviado mensalmente à AGT. 
                    Certifique-se que todos os dados estão corretos antes de gerar o arquivo.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mês</label>
                  <Select value={month} onValueChange={setMonth}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o mês" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Janeiro</SelectItem>
                      <SelectItem value="2">Fevereiro</SelectItem>
                      <SelectItem value="3">Março</SelectItem>
                      <SelectItem value="4">Abril</SelectItem>
                      <SelectItem value="5">Maio</SelectItem>
                      <SelectItem value="6">Junho</SelectItem>
                      <SelectItem value="7">Julho</SelectItem>
                      <SelectItem value="8">Agosto</SelectItem>
                      <SelectItem value="9">Setembro</SelectItem>
                      <SelectItem value="10">Outubro</SelectItem>
                      <SelectItem value="11">Novembro</SelectItem>
                      <SelectItem value="12">Dezembro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Ano</label>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o ano" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2025">2025</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-md space-y-2">
              <h3 className="font-medium">Informações do Arquivo</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>NIF da Empresa:</div>
                <div>5417392481</div>
                <div>Nome da Empresa:</div>
                <div>BEGJNP Pharma</div>
                <div>Versão SAFT:</div>
                <div>1.01_01</div>
                <div>Tipo de Software:</div>
                <div>Sistema de Gestão Farmacêutica</div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">
            <FileCog className="h-4 w-4 mr-1" /> Validar Dados
          </Button>
          <Button onClick={generateSAFT}>
            <FileText className="h-4 w-4 mr-1" /> Gerar SAFT
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const FinancialReportsPage = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate()),
    to: new Date(),
  });

  const formatDate = (date: Date | undefined) => {
    return date ? format(date, 'dd/MM/yyyy', { locale: ptBR }) : 'Data não selecionada';
  };

  const navigate = useNavigate();

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
        <h1 className="text-2xl font-bold">Relatórios Financeiros</h1>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <Calendar className="h-4 w-4 mr-2" />
        <span>Período:</span>
        <DateRangePicker date={date} onDateChange={setDate} />
        <span>
          {formatDate(date?.from)} - {formatDate(date?.to)}
        </span>
      </div>

      <Tabs defaultValue="balanco" className="space-y-4">
        <TabsList>
          <TabsTrigger value="balanco">
            <BarChart3 className="mr-2 h-4 w-4" />
            Balanço Patrimonial
          </TabsTrigger>
          <TabsTrigger value="balancete">
            <Calculator className="mr-2 h-4 w-4" />
            Balancete
          </TabsTrigger>
          <TabsTrigger value="dre">
            <FileBarChart className="mr-2 h-4 w-4" />
            DRE
          </TabsTrigger>
          <TabsTrigger value="saft">
            <ReceiptText className="mr-2 h-4 w-4" />
            SAFT-AO
          </TabsTrigger>
        </TabsList>
        <TabsContent value="balanco" className="space-y-4">
          <BalancoPatrimonial />
        </TabsContent>
        <TabsContent value="balancete" className="space-y-4">
          <Balancete />
        </TabsContent>
        <TabsContent value="dre" className="space-y-4">
          <DemonstraçãoResultado />
        </TabsContent>
        <TabsContent value="saft" className="space-y-4">
          <SAFTReport />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialReportsPage;
