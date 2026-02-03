'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Filter } from 'lucide-react';
import type { Route, Priority, FunderType, Status } from '@/lib/types';

interface FiltersState {
  search: string;
  route: Route | 'all';
  priority: Priority | 'all';
  funderType: FunderType | 'all';
  status: Status | 'all';
}

interface OpportunityFiltersProps {
  filters: FiltersState;
  onFiltersChange: (filters: FiltersState) => void;
}

const ROUTE_OPTIONS: { value: Route | 'all'; label: string }[] = [
  { value: 'all', label: 'All Routes' },
  { value: 'route_1_thrive_focused', label: 'Route 1: Thrive-Focused' },
  { value: 'route_2_ai_enhanced', label: 'Route 2: AI-Enhanced' },
  { value: 'route_3_ai_healthcare', label: 'Route 3: AI+Healthcare' },
  { value: 'route_4_nhelp_vehicle', label: 'Route 4: NHELP Vehicle' },
  { value: 'route_5_sbir_sttr', label: 'Route 5: SBIR/STTR' },
];

const PRIORITY_OPTIONS: { value: Priority | 'all'; label: string }[] = [
  { value: 'all', label: 'All Priorities' },
  { value: 'high_priority', label: 'High Priority' },
  { value: 'pursue', label: 'Pursue' },
  { value: 'opportunistic', label: 'Opportunistic' },
  { value: 'monitor', label: 'Monitor' },
];

const FUNDER_TYPE_OPTIONS: { value: FunderType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Funder Types' },
  { value: 'federal', label: 'Federal' },
  { value: 'private_foundation', label: 'Private Foundation' },
  { value: 'community_foundation', label: 'Community Foundation' },
  { value: 'corporate_foundation', label: 'Corporate Foundation' },
  { value: 'professional_association', label: 'Professional Association' },
  { value: 'nonprofit', label: 'Nonprofit' },
];

const STATUS_OPTIONS: { value: Status | 'all'; label: string }[] = [
  { value: 'all', label: 'All Statuses' },
  { value: 'ready_for_review', label: 'Ready for Review' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'deadline_passed', label: 'Deadline Passed' },
  { value: 'program_closed', label: 'Program Closed' },
];

export function OpportunityFilters({ filters, onFiltersChange }: OpportunityFiltersProps) {
  const updateFilter = <K extends keyof FiltersState>(key: K, value: FiltersState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      route: 'all',
      priority: 'all',
      funderType: 'all',
      status: 'all',
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.route !== 'all' ||
    filters.priority !== 'all' ||
    filters.funderType !== 'all' ||
    filters.status !== 'all';

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search opportunities..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-9"
          />
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="self-end">
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          Filters:
        </div>

        <Select
          value={filters.route}
          onValueChange={(value) => updateFilter('route', value as Route | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Route" />
          </SelectTrigger>
          <SelectContent>
            {ROUTE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.priority}
          onValueChange={(value) => updateFilter('priority', value as Priority | 'all')}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            {PRIORITY_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.funderType}
          onValueChange={(value) => updateFilter('funderType', value as FunderType | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Funder Type" />
          </SelectTrigger>
          <SelectContent>
            {FUNDER_TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.status}
          onValueChange={(value) => updateFilter('status', value as Status | 'all')}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
