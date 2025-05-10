
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '1 Jan', value: 15000 },
  { name: '7 Jan', value: 18000 },
  { name: '14 Jan', value: 24000 },
  { name: '21 Jan', value: 21000 },
  { name: '28 Jan', value: 32000 },
  { name: '4 Fev', value: 28000 },
  { name: '11 Fev', value: 36000 },
  { name: '18 Fev', value: 32000 },
  { name: '25 Fev', value: 39000 },
  { name: '4 Mar', value: 42000 },
];

const SalesTrendsChart: React.FC = () => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Tendência de Vendas</CardTitle>
        <CardDescription>Últimos 10 períodos</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis
                tickFormatter={(value) => `${value / 1000}k`}
                fontSize={12}
              />
              <Tooltip 
                formatter={(value: number) => [`AOA ${value.toLocaleString()}`, 'Vendas']}
                labelFormatter={(label) => `Data: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesTrendsChart;
