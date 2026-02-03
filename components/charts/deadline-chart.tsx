'use client';

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import type { Deadline } from '@/lib/types';
import { format, parseISO } from 'date-fns';

interface DeadlineChartProps {
  deadlines: Deadline[];
  maxItems?: number;
}

export function DeadlineChart({ deadlines, maxItems = 8 }: DeadlineChartProps) {
  const chartData = deadlines
    .slice(0, maxItems)
    .map((d) => ({
      name: d.opportunityName.length > 20
        ? d.opportunityName.substring(0, 20) + '...'
        : d.opportunityName,
      fullName: d.opportunityName,
      daysUntil: d.daysUntil,
      date: format(parseISO(d.date), 'MMM d, yyyy'),
      type: d.type,
      isPast: d.isPast,
    }));

  const getBarColor = (daysUntil: number, isPast: boolean) => {
    if (isPast) return '#6b7280';
    if (daysUntil <= 30) return '#ef4444';
    if (daysUntil <= 60) return '#f59e0b';
    if (daysUntil <= 90) return '#3b82f6';
    return '#10b981';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5" />
          Upcoming Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No upcoming fixed deadlines
          </p>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis
                  type="number"
                  domain={[0, 'dataMax']}
                  tickFormatter={(value) => `${value}d`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={120}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-popover border rounded-lg p-3 shadow-lg">
                          <p className="font-medium text-sm">{data.fullName}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {data.date} ({data.type.toUpperCase()})
                          </p>
                          <p className="text-sm font-medium mt-1">
                            {data.isPast ? 'Passed' : `${data.daysUntil} days`}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="daysUntil" radius={[0, 4, 4, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getBarColor(entry.daysUntil, entry.isPast)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-red-500" /> &lt;30 days
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-amber-500" /> 30-60 days
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-blue-500" /> 60-90 days
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-green-500" /> &gt;90 days
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
