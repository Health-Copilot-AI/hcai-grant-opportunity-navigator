'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Route } from '@/lib/types';

interface RouteDistributionProps {
  data: Record<Route, number>;
}

const ROUTE_COLORS: Record<Route, string> = {
  route_1_thrive_focused: '#8b5cf6',
  route_2_ai_enhanced: '#06b6d4',
  route_3_ai_healthcare: '#ec4899',
  route_4_nhelp_vehicle: '#10b981',
  route_5_sbir_sttr: '#f97316',
  multiple: '#6b7280',
};

const ROUTE_LABELS: Record<Route, string> = {
  route_1_thrive_focused: 'Route 1: Thrive',
  route_2_ai_enhanced: 'Route 2: AI-Enhanced',
  route_3_ai_healthcare: 'Route 3: AI+Healthcare',
  route_4_nhelp_vehicle: 'Route 4: NHELP',
  route_5_sbir_sttr: 'Route 5: SBIR/STTR',
  multiple: 'Multiple',
};

export function RouteDistribution({ data }: RouteDistributionProps) {
  const chartData = Object.entries(data)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => ({
      name: ROUTE_LABELS[key as Route],
      value,
      color: ROUTE_COLORS[key as Route],
    }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Opportunities by Route</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value} opportunities`, 'Count']}
              />
              <Legend
                layout="vertical"
                align="right"
                verticalAlign="middle"
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-xs">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
