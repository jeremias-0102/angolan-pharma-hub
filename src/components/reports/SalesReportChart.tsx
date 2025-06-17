
import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportReportToPDF, exportReportToExcel, generateSalesReport } from '@/services/reportsService';
import { DateRange } from 'react-day-picker';

interface SalesReportChartProps {
  date?: DateRange;
}

const SalesReportChart: React.FC<SalesReportChartProps> = ({ date }) => {
  const [reportData, setReportData] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReportData();
  }, [date]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      const startDate = date?.from?.toISOString();
      const endDate = date?.to?.toISOString();
      
      const report = await generateSalesReport(startDate, endDate);
      
      // Agrupar dados por mês para o gráfico
      const monthlyData = report.data.reduce((acc: any, order: any) => {
        const month = new Date(order.data).toLocaleDateString('pt-AO', { month: 'short' });
        const value = parseInt(order.valor.replace('AOA ', '').replace(/\./g, ''));
        
        if (!acc[month]) {
          acc[month] = { name: month, vendas: 0, lucro: 0 };
        }
        
        acc[month].vendas += value;
        acc[month].lucro += Math.round(value * 0.25); // Estimativa de 25% de lucro
        
        return acc;
      }, {});
      
      setReportData(Object.values(monthlyData));
      setSummary(report.summary);
    } catch (error) {
      console.error('Erro ao carregar dados do relatório:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const startDate = date?.from?.toISOString();
      const endDate = date?.to?.toISOString();
      await exportReportToPDF('sales', startDate, endDate);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      const startDate = date?.from?.toISOString();
      const endDate = date?.to?.toISOString();
      await exportReportToExcel('sales', startDate, endDate);
    } catch (error) {
      console.error('Erro ao exportar Excel:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Carregando dados...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4 text-sm text-gray-600">
          <span>Total de Vendas: AOA {summary.totalSales?.toLocaleString() || 0}</span>
          <span>Pedidos: {summary.totalOrders || 0}</span>
          <span>Ticket Médio: AOA {Math.round(summary.avgOrderValue || 0).toLocaleString()}</span>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center"
            onClick={handleDownloadExcel}
          >
            <Download className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center"
            onClick={handleDownloadPDF}
          >
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      <div id="sales-report" className="bg-white p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Relatório de Vendas - Dados Reais</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={reportData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis 
              tickFormatter={(value) => `${Math.round(value/1000)}k`}
            />
            <Tooltip 
              formatter={(value: number) => [`AOA ${value.toLocaleString()}`, '']}
            />
            <Legend />
            <Bar dataKey="vendas" name="Vendas" fill="#8884d8" />
            <Bar dataKey="lucro" name="Lucro" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SalesReportChart;
