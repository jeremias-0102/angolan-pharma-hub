
import React from 'react';
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
import { exportToPDF, exportToExcel } from '@/utils/reportExport';
import { DateRange } from 'react-day-picker';

const data = [
  { name: 'Jan', vendas: 65000, lucro: 15000 },
  { name: 'Fev', vendas: 78000, lucro: 18000 },
  { name: 'Mar', vendas: 98000, lucro: 24000 },
  { name: 'Abr', vendas: 85000, lucro: 21000 },
  { name: 'Mai', vendas: 105000, lucro: 28000 },
  { name: 'Jun', vendas: 92000, lucro: 22000 },
];

interface SalesReportChartProps {
  date?: DateRange;
}

const SalesReportChart: React.FC<SalesReportChartProps> = ({ date }) => {
  const handleDownloadPDF = () => {
    const columns = [
      { header: 'Mês', accessor: 'name' },
      { header: 'Vendas (AOA)', accessor: 'vendas' },
      { header: 'Lucro (AOA)', accessor: 'lucro' }
    ];
    
    exportToPDF('Relatório de Vendas', data, columns);
  };

  const handleDownloadExcel = () => {
    exportToExcel('Relatório de Vendas', data, [
      { header: 'Mês', accessor: 'name' },
      { header: 'Vendas (AOA)', accessor: 'vendas' },
      { header: 'Lucro (AOA)', accessor: 'lucro' }
    ]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2">
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

      <div id="sales-report" className="bg-white p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Relatório de Vendas 2025</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
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
              tickFormatter={(value) => `${value/1000}k`}
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
