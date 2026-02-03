import { getGlobalIndex } from '@/lib/data/opportunities';
import { StatCard } from '@/components/dashboard/stat-card';
import { PriorityList } from '@/components/dashboard/priority-list';
import { RelationshipBadges } from '@/components/dashboard/relationship-badges';
import { RouteDistribution } from '@/components/charts/route-distribution';
import { DeadlineChart } from '@/components/charts/deadline-chart';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const data = await getGlobalIndex();

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Grant opportunity overview for NeighborhoodHELP & FIU Thrive
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Opportunities"
          value={data.stats.totalOpportunities}
          iconName="folder-open"
          color="purple"
        />
        <StatCard
          title="High Priority"
          value={data.stats.byPriority.high_priority}
          iconName="alert-triangle"
          color="red"
        />
        <StatCard
          title="Rolling Deadlines"
          value={data.rollingOpportunities.length}
          subtitle="Active & open"
          iconName="refresh-cw"
          color="green"
        />
        <StatCard
          title="Passed Deadlines"
          value={data.stats.byStatus.deadline_passed + data.stats.byStatus.program_closed}
          iconName="x-circle"
          color="default"
        />
      </div>

      {/* Funding Summary */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          title="Total Funding Available"
          value={`${formatCurrency(data.stats.totalFunding.min)} - ${formatCurrency(data.stats.totalFunding.max)}`}
          subtitle="Across all opportunities"
          iconName="dollar-sign"
          color="blue"
        />
        <StatCard
          title="Avg Weighted Score"
          value={(data.highPriorityOpportunities.reduce((acc, o) => acc + o.weightedScore, 0) / Math.max(data.highPriorityOpportunities.length, 1)).toFixed(2)}
          subtitle="High priority opportunities"
          iconName="target"
          color="amber"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Priority List */}
        <PriorityList opportunities={data.highPriorityOpportunities} />

        {/* Prior Relationships */}
        <RelationshipBadges relationships={data.priorRelationships} />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Deadline Chart */}
        <DeadlineChart deadlines={data.upcomingDeadlines} />

        {/* Route Distribution */}
        <RouteDistribution data={data.stats.byRoute} />
      </div>
    </div>
  );
}
