
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

const data = [
  { name: 'Jan', compras: 42000 },
  { name: 'Fev', compras: 53000 },
  { name: 'Mar', compras: 61000 },
  { name: 'Abr', compras: 45000 },
  { name: 'Mai', compras: 70000 },
  { name: 'Jun', compras: 52000 },
];

const PurchasesReportChart: React.FC = () => {
  return (
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
  );
};

export default PurchasesReportChart;
