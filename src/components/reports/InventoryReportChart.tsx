
import React from 'react';
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
import { exportToPDF, exportToExcel } from '@/utils/reportExport';
import { DateRange } from 'react-day-picker';

const data = [
  { name: 'Jan', estoque: 120, minimo: 25 },
  { name: 'Fev', estoque: 105, minimo: 25 },
  { name: 'Mar', estoque: 140, minimo: 25 },
  { name: 'Abr', estoque: 90, minimo: 25 },
  { name: 'Mai', estoque: 75, minimo: 25 },
  { name: 'Jun', estoque: 110, minimo: 25 },
];

interface InventoryReportChartProps {
  date?: DateRange;
}

const InventoryReportChart: React.FC<InventoryReportChartProps> = ({ date }) => {
  const handleDownloadPDF = () => {
    const columns = [
      { header: 'Mês', accessor: 'name' },
      { header: 'Nível de Estoque', accessor: 'estoque' },
      { header: 'Estoque Mínimo', accessor: 'minimo' }
    ];
    
    exportToPDF('Relatório de Estoque', data, columns);
  };

  const handleDownloadExcel = () => {
    exportToExcel('Relatório de Estoque', data, [
      { header: 'Mês', accessor: 'name' },
      { header: 'Nível de Estoque', accessor: 'estoque' },
      { header: 'Estoque Mínimo', accessor: 'minimo' }
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

      <div id="inventory-report" className="bg-white p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Relatório de Estoque 2025</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={data}
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
