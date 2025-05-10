
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

const data = [
  { name: 'Jan', vendas: 65000, lucro: 15000 },
  { name: 'Fev', vendas: 78000, lucro: 18000 },
  { name: 'Mar', vendas: 98000, lucro: 24000 },
  { name: 'Abr', vendas: 85000, lucro: 21000 },
  { name: 'Mai', vendas: 105000, lucro: 28000 },
  { name: 'Jun', vendas: 92000, lucro: 22000 },
];

const SalesReportChart: React.FC = () => {
  return (
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
  );
};

export default SalesReportChart;
