'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';
import {
  FolderOpen,
  AlertTriangle,
  RefreshCw,
  XCircle,
  DollarSign,
  Target,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  Star,
} from 'lucide-react';

const iconMap = {
  'folder-open': FolderOpen,
  'alert-triangle': AlertTriangle,
  'refresh-cw': RefreshCw,
  'x-circle': XCircle,
  'dollar-sign': DollarSign,
  target: Target,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  calendar: Calendar,
  users: Users,
  star: Star,
};

export type IconName = keyof typeof iconMap;

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  iconName?: IconName;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'default' | 'red' | 'green' | 'blue' | 'purple' | 'amber';
}

const colorClasses = {
  default: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
  red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
};

export function StatCard({
  title,
  value,
  subtitle,
  iconName,
  color = 'default',
}: StatCardProps) {
  const Icon = iconName ? iconMap[iconName] : null;

  return (
    <Card className={cn('transition-all hover:shadow-md', colorClasses[color])}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-80">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs opacity-60 mt-1">{subtitle}</p>
            )}
          </div>
          {Icon && (
            <div className="p-3 rounded-full bg-white/50 dark:bg-black/20">
              <Icon className="h-6 w-6" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
