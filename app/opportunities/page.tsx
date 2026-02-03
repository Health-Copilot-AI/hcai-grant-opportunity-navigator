'use client';

import { useState, useEffect, useMemo } from 'react';
import { OpportunityCard } from '@/components/opportunities/opportunity-card';
import { OpportunityTable } from '@/components/opportunities/opportunity-table';
import { OpportunityFilters } from '@/components/opportunities/opportunity-filters';
import { Button } from '@/components/ui/button';
import { LayoutGrid, TableIcon } from 'lucide-react';
import type { Opportunity, Route, Priority, FunderType, Status } from '@/lib/types';

type ViewMode = 'grid' | 'table';

interface FiltersState {
  search: string;
  route: Route | 'all';
  priority: Priority | 'all';
  funderType: FunderType | 'all';
  status: Status | 'all';
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<FiltersState>({
    search: '',
    route: 'all',
    priority: 'all',
    funderType: 'all',
    status: 'all',
  });

  useEffect(() => {
    fetch('/api/opportunities')
      .then((res) => res.json())
      .then((data) => {
        setOpportunities(data.opportunities || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch opportunities:', err);
        setLoading(false);
      });
  }, []);

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          opp.name.toLowerCase().includes(searchLower) ||
          opp.funder.toLowerCase().includes(searchLower) ||
          opp.program.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Route filter
      if (filters.route !== 'all' && opp.route !== filters.route) return false;

      // Priority filter
      if (filters.priority !== 'all' && opp.priority !== filters.priority) return false;

      // Funder type filter
      if (filters.funderType !== 'all' && opp.funderType !== filters.funderType) return false;

      // Status filter
      if (filters.status !== 'all' && opp.status !== filters.status) return false;

      return true;
    });
  }, [opportunities, filters]);

  // Sort by weighted score (highest first), then by deadline
  const sortedOpportunities = useMemo(() => {
    return [...filteredOpportunities].sort((a, b) => {
      // Active opportunities first
      const aActive = a.status === 'ready_for_review' || a.status === 'in_progress';
      const bActive = b.status === 'ready_for_review' || b.status === 'in_progress';
      if (aActive && !bActive) return -1;
      if (!aActive && bActive) return 1;

      // Then by weighted score
      return b.weightedScore - a.weightedScore;
    });
  }, [filteredOpportunities]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Opportunities</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-48 rounded-lg bg-muted animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">All Opportunities</h1>
          <p className="text-muted-foreground">
            {filteredOpportunities.length} of {opportunities.length} opportunities
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 border rounded-lg p-1 bg-muted/30">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="h-8"
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('table')}
            className="h-8"
          >
            <TableIcon className="h-4 w-4 mr-2" />
            Table
          </Button>
        </div>
      </div>

      <OpportunityFilters filters={filters} onFiltersChange={setFilters} />

      {sortedOpportunities.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No opportunities match your filters</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedOpportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      ) : (
        <OpportunityTable opportunities={filteredOpportunities} />
      )}
    </div>
  );
}
