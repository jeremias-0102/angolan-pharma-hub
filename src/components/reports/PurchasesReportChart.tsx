
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { downloadPDF, downloadExcel } from '@/utils/reportExport';

const data = [
  { name: 'Jan', compras: 42000 },
  { name: 'Fev', compras: 53000 },
  { name: 'Mar', compras: 61000 },
  { name: 'Abr', compras: 45000 },
  { name: 'Mai', compras: 70000 },
  { name: 'Jun', compras: 52000 },
];

const PurchasesReportChart: React.FC = () => {
  const handleDownloadPDF = () => {
    downloadPDF('purchases-report', 'Relatório de Compras');
  };

  const handleDownloadExcel = () => {
    downloadExcel(data, 'relatorio-compras');
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

      <div id="purchases-report" className="bg-white p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">Relatório de Compras 2025</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{
              top: 5,
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
              formatter={(value: number) => [`AOA ${value.toLocaleString()}`, 'Valor de Compras']}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="compras" 
              name="Compras"
              stroke="#82ca9d" 
              activeDot={{ r: 8 }} 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PurchasesReportChart;
