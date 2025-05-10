
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

const data = [
  { name: 'Jan', estoque: 120, minimo: 25 },
  { name: 'Fev', estoque: 105, minimo: 25 },
  { name: 'Mar', estoque: 140, minimo: 25 },
  { name: 'Abr', estoque: 90, minimo: 25 },
  { name: 'Mai', estoque: 75, minimo: 25 },
  { name: 'Jun', estoque: 110, minimo: 25 },
];

const InventoryReportChart: React.FC = () => {
  return (
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
  );
};

export default InventoryReportChart;
