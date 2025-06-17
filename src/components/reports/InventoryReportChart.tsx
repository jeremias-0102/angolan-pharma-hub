
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportReportToPDF, exportReportToExcel, generateInventoryReport } from '@/services/reportsService';
import { DateRange } from 'react-day-picker';

interface InventoryReportChartProps {
  date?: DateRange;
}

const InventoryReportChart: React.FC<InventoryReportChartProps> = ({ date }) => {
  const [reportData, setReportData] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    try {
      setLoading(true);
      const report = await generateInventoryReport();
      
      // Agrupar produtos por categoria para o gráfico
      const categoryData = report.data.reduce((acc: any, product: any) => {
        const category = product.categoria || 'Sem Categoria';
        
        if (!acc[category]) {
          acc[category] = { name: category, estoque: 0, minimo: 25 };
        }
        
        acc[category].estoque += product.estoque;
        
        return acc;
      }, {});
      
      setReportData(Object.values(categoryData));
      setSummary(report.summary);
    } catch (error) {
      console.error('Erro ao carregar dados do estoque:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await exportReportToPDF('inventory');
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
    }
  };

  const handleDownloadExcel = async () => {
    try {
      await exportReportToExcel('inventory');
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
          <span>Total de Produtos: {summary.totalProducts || 0}</span>
          <span>Estoque Baixo: {summary.lowStockProducts || 0}</span>
          <span>Valor Total: AOA {Math.round(summary.totalInventoryValue || 0).toLocaleString()}</span>
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

      <div id="inventory-report" className="bg-white p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Relatório de Estoque - Dados Reais</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={reportData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="estoque" name="Nível de Estoque" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
            <Area type="monotone" dataKey="minimo" name="Estoque Mínimo" stroke="#ff8042" fill="#ff8042" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default InventoryReportChart;
