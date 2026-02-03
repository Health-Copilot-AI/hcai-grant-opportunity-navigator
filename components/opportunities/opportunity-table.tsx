'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Settings2,
  Star,
  ExternalLink,
} from 'lucide-react';
import type { Opportunity } from '@/lib/types';

interface OpportunityTableProps {
  opportunities: Opportunity[];
}

type SortField = 'name' | 'funder' | 'weightedScore' | 'amountMax' | 'deadlineDate' | 'priority' | 'route' | 'status';
type SortDirection = 'asc' | 'desc';

interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  sortable: boolean;
}

const defaultColumns: ColumnConfig[] = [
  { id: 'name', label: 'Opportunity', visible: true, sortable: true },
  { id: 'funder', label: 'Funder', visible: true, sortable: true },
  { id: 'amount', label: 'Amount', visible: true, sortable: true },
  { id: 'deadline', label: 'Deadline', visible: true, sortable: true },
  { id: 'priority', label: 'Priority', visible: true, sortable: true },
  { id: 'score', label: 'Score', visible: true, sortable: true },
  { id: 'route', label: 'Route', visible: false, sortable: true },
  { id: 'status', label: 'Status', visible: false, sortable: true },
  { id: 'funderType', label: 'Funder Type', visible: false, sortable: true },
  { id: 'relationship', label: 'Relationship', visible: true, sortable: false },
];

const priorityOrder = { high_priority: 0, pursue: 1, opportunistic: 2, monitor: 3 };
const statusOrder = { in_progress: 0, ready_for_review: 1, deadline_passed: 2, program_closed: 3 };

const routeLabels: Record<string, string> = {
  route_1_thrive_focused: 'Route 1',
  route_2_ai_enhanced: 'Route 2',
  route_3_ai_healthcare: 'Route 3',
  route_4_nhelp_vehicle: 'Route 4',
  route_5_sbir_sttr: 'Route 5',
  multiple: 'Multiple',
};

const priorityColors: Record<string, string> = {
  high_priority: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  pursue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  opportunistic: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  monitor: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
};

export function OpportunityTable({ opportunities }: OpportunityTableProps) {
  const [sortField, setSortField] = useState<SortField>('weightedScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [columns, setColumns] = useState<ColumnConfig[]>(defaultColumns);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const toggleColumn = (columnId: string) => {
    setColumns(columns.map(col =>
      col.id === columnId ? { ...col, visible: !col.visible } : col
    ));
  };

  const sortedOpportunities = useMemo(() => {
    return [...opportunities].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'funder':
          comparison = a.funder.localeCompare(b.funder);
          break;
        case 'weightedScore':
          comparison = a.weightedScore - b.weightedScore;
          break;
        case 'amountMax':
          comparison = a.amountMax - b.amountMax;
          break;
        case 'deadlineDate':
          const dateA = a.deadlineDate || '9999-12-31';
          const dateB = b.deadlineDate || '9999-12-31';
          comparison = dateA.localeCompare(dateB);
          break;
        case 'priority':
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'status':
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        case 'route':
          comparison = a.route.localeCompare(b.route);
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [opportunities, sortField, sortDirection]);

  const formatAmount = (min: number, max: number) => {
    if (max === 0) return 'TBD';
    const formatNum = (n: number) => {
      if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
      return `$${(n / 1000).toFixed(0)}K`;
    };
    if (min === max) return formatNum(max);
    return `${formatNum(min)} - ${formatNum(max)}`;
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    }
    return sortDirection === 'asc'
      ? <ArrowUp className="h-4 w-4 ml-1" />
      : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  const visibleColumns = columns.filter(col => col.visible);

  return (
    <div className="space-y-4">
      {/* Column Customization */}
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings2 className="h-4 w-4 mr-2" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {columns.map(column => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.visible}
                onCheckedChange={() => toggleColumn(column.id)}
              >
                {column.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                {visibleColumns.map(column => (
                  <th
                    key={column.id}
                    className={`px-4 py-3 text-left font-medium text-muted-foreground ${
                      column.sortable ? 'cursor-pointer hover:bg-muted/80 select-none' : ''
                    }`}
                    onClick={() => {
                      if (column.sortable) {
                        const fieldMap: Record<string, SortField> = {
                          name: 'name',
                          funder: 'funder',
                          amount: 'amountMax',
                          deadline: 'deadlineDate',
                          priority: 'priority',
                          score: 'weightedScore',
                          route: 'route',
                          status: 'status',
                        };
                        if (fieldMap[column.id]) {
                          handleSort(fieldMap[column.id]);
                        }
                      }
                    }}
                  >
                    <div className="flex items-center">
                      {column.label}
                      {column.sortable && (
                        <SortIcon
                          field={
                            ({
                              name: 'name',
                              funder: 'funder',
                              amount: 'amountMax',
                              deadline: 'deadlineDate',
                              priority: 'priority',
                              score: 'weightedScore',
                              route: 'route',
                              status: 'status',
                            } as Record<string, SortField>)[column.id] || 'weightedScore'
                          }
                        />
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3 text-right font-medium text-muted-foreground w-10">
                  {/* Actions */}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sortedOpportunities.map(opp => (
                <tr
                  key={opp.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  {visibleColumns.map(column => (
                    <td key={column.id} className="px-4 py-3">
                      {column.id === 'name' && (
                        <div className="flex items-center gap-2">
                          {opp.priorRelationship.exists && (
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500 flex-shrink-0" />
                          )}
                          <Link
                            href={`/opportunities/${opp.id}`}
                            className="font-medium hover:text-primary hover:underline"
                          >
                            {opp.name}
                          </Link>
                        </div>
                      )}
                      {column.id === 'funder' && (
                        <span className="text-muted-foreground">{opp.funder}</span>
                      )}
                      {column.id === 'amount' && (
                        <span className="font-mono text-xs">
                          {formatAmount(opp.amountMin, opp.amountMax)}
                        </span>
                      )}
                      {column.id === 'deadline' && (
                        <span className="text-muted-foreground">
                          {opp.deadlineDate || opp.deadlineType.replace('_', ' ')}
                        </span>
                      )}
                      {column.id === 'priority' && (
                        <Badge className={`text-xs ${priorityColors[opp.priority]}`}>
                          {opp.priority.replace('_', ' ').toUpperCase()}
                        </Badge>
                      )}
                      {column.id === 'score' && (
                        <span className="font-bold text-purple-600 dark:text-purple-400">
                          {opp.weightedScore.toFixed(2)}
                        </span>
                      )}
                      {column.id === 'route' && (
                        <Badge variant="outline" className="text-xs">
                          {routeLabels[opp.route]}
                        </Badge>
                      )}
                      {column.id === 'status' && (
                        <Badge
                          variant={opp.status === 'deadline_passed' ? 'secondary' : 'default'}
                          className="text-xs"
                        >
                          {opp.status.replace(/_/g, ' ')}
                        </Badge>
                      )}
                      {column.id === 'funderType' && (
                        <span className="text-muted-foreground text-xs capitalize">
                          {opp.funderType.replace('_', ' ')}
                        </span>
                      )}
                      {column.id === 'relationship' && (
                        opp.priorRelationship.exists ? (
                          <Badge variant="outline" className="text-xs bg-amber-50 dark:bg-amber-900/20 border-amber-200">
                            {opp.priorRelationship.type.replace('_', ' ')}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right">
                    <Link href={`/opportunities/${opp.id}`}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-sm text-muted-foreground text-center">
        Showing {sortedOpportunities.length} opportunities
      </div>
    </div>
  );
}
