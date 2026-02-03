'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ArrowRight, Calendar, DollarSign } from 'lucide-react';
import type { Opportunity } from '@/lib/types';

interface PriorityListProps {
  opportunities: Opportunity[];
  title?: string;
  showAll?: boolean;
}

export function PriorityList({ opportunities, title = 'Immediate Action Required', showAll = false }: PriorityListProps) {
  const displayOps = showAll ? opportunities : opportunities.slice(0, 5);

  const formatAmount = (min: number, max: number) => {
    if (max === 0) return 'TBD';
    if (min === max) return `$${(max / 1000).toFixed(0)}K`;
    return `$${(min / 1000).toFixed(0)}K - $${(max / 1000).toFixed(0)}K`;
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'high_priority': return 'high_priority';
      case 'pursue': return 'pursue';
      case 'opportunistic': return 'opportunistic';
      default: return 'monitor';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertCircle className="h-5 w-5 text-red-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayOps.length === 0 ? (
          <p className="text-sm text-muted-foreground">No immediate actions required</p>
        ) : (
          displayOps.map((opp) => (
            <Link
              key={opp.id}
              href={`/opportunities/${opp.id}`}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium truncate">{opp.name}</p>
                  <Badge variant={getPriorityBadgeVariant(opp.priority)} className="text-xs">
                    {opp.priority === 'high_priority' ? 'HIGH' : opp.priority.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {formatAmount(opp.amountMin, opp.amountMax)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {opp.deadlineDate || opp.deadlineType}
                  </span>
                  <span className="font-medium text-purple-600 dark:text-purple-400">
                    {opp.weightedScore.toFixed(2)}
                  </span>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </Link>
          ))
        )}
        {!showAll && opportunities.length > 5 && (
          <Link
            href="/opportunities?priority=high_priority"
            className="block text-center text-sm text-primary hover:underline pt-2"
          >
            View all {opportunities.length} high priority opportunities
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
