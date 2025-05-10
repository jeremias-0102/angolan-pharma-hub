
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Analgésicos', value: 42, color: '#8884d8' },
  { name: 'Antibióticos', value: 28, color: '#82ca9d' },
  { name: 'Vitaminas', value: 15, color: '#ffc658' },
  { name: 'Antialérgicos', value: 10, color: '#ff8042' },
  { name: 'Outros', value: 5, color: '#0088fe' },
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];

const StockDistributionChart: React.FC = () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Distribuição de Estoque</CardTitle>
        <CardDescription>Por categoria de produto</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'Percentagem']}
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center" 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockDistributionChart;
