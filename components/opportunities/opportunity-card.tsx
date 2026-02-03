'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, MapPin, ArrowRight, Star, Zap } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { Opportunity, Route, Priority } from '@/lib/types';

interface OpportunityCardProps {
  opportunity: Opportunity;
  compact?: boolean;
}

const routeColors: Record<Route, string> = {
  route_1_thrive_focused: 'border-l-purple-500',
  route_2_ai_enhanced: 'border-l-cyan-500',
  route_3_ai_healthcare: 'border-l-pink-500',
  route_4_nhelp_vehicle: 'border-l-emerald-500',
  route_5_sbir_sttr: 'border-l-orange-500',
  multiple: 'border-l-gray-500',
};

const routeLabels: Record<Route, string> = {
  route_1_thrive_focused: 'Route 1',
  route_2_ai_enhanced: 'Route 2',
  route_3_ai_healthcare: 'Route 3',
  route_4_nhelp_vehicle: 'Route 4',
  route_5_sbir_sttr: 'Route 5',
  multiple: 'Multiple',
};

const priorityBadges: Record<Priority, { variant: 'high_priority' | 'pursue' | 'opportunistic' | 'monitor'; label: string }> = {
  high_priority: { variant: 'high_priority', label: 'HIGH' },
  pursue: { variant: 'pursue', label: 'PURSUE' },
  opportunistic: { variant: 'opportunistic', label: 'OPPORTUNISTIC' },
  monitor: { variant: 'monitor', label: 'MONITOR' },
};

export function OpportunityCard({ opportunity: opp, compact = false }: OpportunityCardProps) {
  const formatAmount = (min: number, max: number) => {
    if (max === 0) return 'TBD';
    const formatNum = (n: number) => {
      if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
      return `$${(n / 1000).toFixed(0)}K`;
    };
    if (min === max) return formatNum(max);
    return `${formatNum(min)} - ${formatNum(max)}`;
  };

  const getDeadlineDisplay = () => {
    if (opp.status === 'deadline_passed') return 'PASSED';
    if (opp.status === 'program_closed') return 'CLOSED';
    if (opp.deadlineType === 'rolling') return 'Rolling';
    if (opp.deadlineType === 'by_invitation') return 'By Invitation';
    if (opp.deadlineDate) {
      return new Date(opp.deadlineDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return opp.deadlineType;
  };

  const isUrgent = opp.priority === 'high_priority' && opp.status !== 'deadline_passed';
  const isPassed = opp.status === 'deadline_passed' || opp.status === 'program_closed';

  return (
    <Link href={`/opportunities/${opp.id}`}>
      <Card
        className={cn(
          'border-l-4 transition-all hover:shadow-lg hover:scale-[1.01] cursor-pointer group',
          routeColors[opp.route],
          isPassed && 'opacity-60',
          isUrgent && 'ring-2 ring-red-500/20'
        )}
      >
        <CardHeader className={cn('pb-2', compact && 'p-4')}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {opp.priorRelationship.exists && (
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500 flex-shrink-0" />
                )}
                <h3 className={cn('font-semibold truncate', compact ? 'text-sm' : 'text-base')}>
                  {opp.name}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground truncate">{opp.funder}</p>
            </div>
            <Badge variant={priorityBadges[opp.priority].variant} className="flex-shrink-0 text-xs">
              {priorityBadges[opp.priority].label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className={cn('space-y-3', compact && 'p-4 pt-0')}>
          <div className="flex flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1 text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              <span className="font-medium">{formatAmount(opp.amountMin, opp.amountMax)}</span>
            </div>
            <div className={cn(
              'flex items-center gap-1',
              isPassed ? 'text-gray-500' : opp.deadlineType === 'rolling' ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
            )}>
              <Calendar className="h-3 w-3" />
              <span className={cn(isPassed && 'line-through')}>{getDeadlineDisplay()}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {routeLabels[opp.route]}
              </Badge>
              {opp.priorRelationship.exists && (
                <Badge variant="outline" className="text-xs bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                  Prior Relationship
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3 text-purple-500" />
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                  {opp.weightedScore.toFixed(2)}
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
