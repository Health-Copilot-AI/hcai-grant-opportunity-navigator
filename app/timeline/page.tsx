import { getGlobalIndex } from '@/lib/data/opportunities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DeadlineChart } from '@/components/charts/deadline-chart';
import { Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function TimelinePage() {
  const data = await getGlobalIndex();

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMMM d, yyyy');
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Timeline</h1>
        <p className="text-muted-foreground">
          Track upcoming and past grant deadlines
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{data.upcomingDeadlines.length}</p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{data.rollingOpportunities.length}</p>
                <p className="text-sm text-muted-foreground">Rolling</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <CheckCircle className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{data.passedDeadlines.length}</p>
                <p className="text-sm text-muted-foreground">Passed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deadline Chart */}
      <DeadlineChart deadlines={data.upcomingDeadlines} maxItems={12} />

      {/* Upcoming Deadlines List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Upcoming Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.upcomingDeadlines.length === 0 ? (
            <p className="text-muted-foreground">No upcoming fixed deadlines</p>
          ) : (
            <div className="space-y-3">
              {data.upcomingDeadlines.map((deadline) => (
                <Link
                  key={`${deadline.opportunityId}-${deadline.date}-${deadline.type}`}
                  href={`/opportunities/${deadline.opportunityId}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div>
                    <p className="font-medium">{deadline.opportunityName}</p>
                    <p className="text-sm text-muted-foreground">{deadline.funder}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatDate(deadline.date)}</p>
                    <div className="flex items-center gap-2 justify-end">
                      <Badge
                        variant={
                          deadline.daysUntil <= 30
                            ? 'destructive'
                            : deadline.daysUntil <= 60
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {deadline.daysUntil} days
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {deadline.type.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rolling Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-500" />
            Rolling Deadlines (Always Open)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.rollingOpportunities.map((opp) => (
              <Link
                key={opp.id}
                href={`/opportunities/${opp.id}`}
                className="p-3 rounded-lg border hover:border-primary transition-colors"
              >
                <p className="font-medium text-sm truncate">{opp.name}</p>
                <p className="text-xs text-muted-foreground truncate">{opp.funder}</p>
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="rolling" className="text-xs">Rolling</Badge>
                  <span className="text-xs font-medium text-purple-600">
                    {opp.weightedScore.toFixed(2)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Passed Deadlines */}
      {data.passedDeadlines.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="h-5 w-5" />
              Passed Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.passedDeadlines.slice(0, 10).map((deadline) => (
                <Link
                  key={`${deadline.opportunityId}-${deadline.date}`}
                  href={`/opportunities/${deadline.opportunityId}`}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors opacity-60"
                >
                  <div>
                    <p className="text-sm font-medium line-through">{deadline.opportunityName}</p>
                    <p className="text-xs text-muted-foreground">{deadline.funder}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{formatDate(deadline.date)}</p>
                    <Badge variant="outline" className="text-xs">
                      {Math.abs(deadline.daysUntil)} days ago
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
