'use client';

import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, PolarRadiusAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Scores } from '@/lib/types';

interface ScoreRadarProps {
  scores: Scores;
  weightedScore: number;
}

export function ScoreRadar({ scores, weightedScore }: ScoreRadarProps) {
  const data = [
    { dimension: 'Funder Alignment', score: scores.funderAlignment, fullMark: 5 },
    { dimension: 'Capability Match', score: scores.capabilityMatch, fullMark: 5 },
    { dimension: 'Success Probability', score: scores.successProbability, fullMark: 5 },
    { dimension: 'Strategic Value', score: scores.strategicValue, fullMark: 5 },
    { dimension: 'Resource Efficiency', score: scores.resourceEfficiency, fullMark: 5 },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Alignment Scores</CardTitle>
          <div className="text-right">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {weightedScore.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">Weighted Score</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data}>
              <PolarGrid gridType="polygon" />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{ fontSize: 10 }}
                tickLine={false}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 5]}
                tick={{ fontSize: 10 }}
                tickCount={6}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.5}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {data.map((item) => (
            <div key={item.dimension} className="flex justify-between text-xs">
              <span className="text-muted-foreground">{item.dimension}</span>
              <span className="font-medium">{item.score.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
