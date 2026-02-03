'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Handshake, Star, CheckCircle2 } from 'lucide-react';
import type { RelationshipSummary } from '@/lib/types';

interface RelationshipBadgesProps {
  relationships: RelationshipSummary[];
}

const relationshipIcons = {
  current_grantee: Star,
  prior_funded: CheckCircle2,
  prior_contact: Handshake,
};

const relationshipColors = {
  current_grantee: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
  prior_funded: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  prior_contact: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800',
};

export function RelationshipBadges({ relationships }: RelationshipBadgesProps) {
  const formatAmount = (amount?: number) => {
    if (!amount) return '';
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  // Group by relationship type
  const currentGrantees = relationships.filter(r => r.type === 'current_grantee');
  const priorFunded = relationships.filter(r => r.type === 'prior_funded');
  const priorContact = relationships.filter(r => r.type === 'prior_contact');

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Handshake className="h-5 w-5 text-blue-500" />
          Leverage Prior Relationships
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentGrantees.length > 0 && (
          <div>
            <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-2 flex items-center gap-1">
              <Star className="h-3 w-3" /> CURRENT GRANTEES
            </p>
            <div className="flex flex-wrap gap-2">
              {currentGrantees.map((rel) => (
                <Link key={rel.opportunityId} href={`/opportunities/${rel.opportunityId}`}>
                  <Badge
                    className={`${relationshipColors.current_grantee} hover:opacity-80 cursor-pointer transition-opacity`}
                  >
                    {rel.funder}
                    {rel.amount && <span className="ml-1 opacity-75">{formatAmount(rel.amount)}</span>}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {priorFunded.length > 0 && (
          <div>
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> PRIOR FUNDED
            </p>
            <div className="flex flex-wrap gap-2">
              {priorFunded.map((rel) => (
                <Link key={rel.opportunityId} href={`/opportunities/${rel.opportunityId}`}>
                  <Badge
                    className={`${relationshipColors.prior_funded} hover:opacity-80 cursor-pointer transition-opacity`}
                  >
                    {rel.funder}
                    {rel.amount && <span className="ml-1 opacity-75">{formatAmount(rel.amount)}</span>}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {priorContact.length > 0 && (
          <div>
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1">
              <Handshake className="h-3 w-3" /> PRIOR CONTACT
            </p>
            <div className="flex flex-wrap gap-2">
              {priorContact.map((rel) => (
                <Link key={rel.opportunityId} href={`/opportunities/${rel.opportunityId}`}>
                  <Badge
                    className={`${relationshipColors.prior_contact} hover:opacity-80 cursor-pointer transition-opacity`}
                  >
                    {rel.funder}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        )}

        {relationships.length === 0 && (
          <p className="text-sm text-muted-foreground">No prior relationships documented</p>
        )}
      </CardContent>
    </Card>
  );
}
