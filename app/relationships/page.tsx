import { getGlobalIndex, getAllOpportunities } from '@/lib/data/opportunities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Handshake, Star, CheckCircle2, DollarSign, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function RelationshipsPage() {
  const [globalData, opportunities] = await Promise.all([
    getGlobalIndex(),
    getAllOpportunities(),
  ]);

  // Get opportunities with prior relationships
  const withRelationships = opportunities.filter((o) => o.priorRelationship.exists);

  const currentGrantees = withRelationships.filter(
    (o) => o.priorRelationship.type === 'current_grantee'
  );
  const priorFunded = withRelationships.filter(
    (o) => o.priorRelationship.type === 'prior_funded'
  );
  const priorContact = withRelationships.filter(
    (o) => o.priorRelationship.type === 'prior_contact'
  );

  const formatAmount = (amount?: number) => {
    if (!amount) return null;
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  const RelationshipCard = ({ opportunity, type }: { opportunity: typeof opportunities[0]; type: string }) => (
    <Link href={`/opportunities/${opportunity.id}`}>
      <Card className="hover:shadow-md transition-all hover:border-primary cursor-pointer">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {type === 'current_grantee' && (
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                )}
                {type === 'prior_funded' && (
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                )}
                {type === 'prior_contact' && (
                  <Handshake className="h-4 w-4 text-purple-500" />
                )}
                <h3 className="font-semibold">{opportunity.funder}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{opportunity.name}</p>
              {opportunity.priorRelationship.description && (
                <p className="text-xs text-muted-foreground mb-2">
                  {opportunity.priorRelationship.description}
                </p>
              )}
              <div className="flex items-center gap-2">
                {opportunity.priorRelationship.amount && (
                  <Badge variant="outline" className="text-xs">
                    <DollarSign className="h-3 w-3 mr-1" />
                    {formatAmount(opportunity.priorRelationship.amount)}
                  </Badge>
                )}
                <Badge
                  variant={
                    opportunity.status === 'deadline_passed'
                      ? 'secondary'
                      : opportunity.priority === 'high_priority'
                      ? 'destructive'
                      : 'default'
                  }
                  className="text-xs"
                >
                  {opportunity.status === 'deadline_passed'
                    ? 'Passed'
                    : opportunity.priority === 'high_priority'
                    ? 'HIGH'
                    : 'Active'}
                </Badge>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Prior Relationships</h1>
        <p className="text-muted-foreground">
          Leverage existing funder relationships for higher success rates
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-amber-500 fill-amber-500" />
              <div>
                <p className="text-3xl font-bold">{currentGrantees.length}</p>
                <p className="text-sm text-muted-foreground">Current Grantees</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-3xl font-bold">{priorFunded.length}</p>
                <p className="text-sm text-muted-foreground">Prior Funded</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Handshake className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-3xl font-bold">{priorContact.length}</p>
                <p className="text-sm text-muted-foreground">Prior Contact</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Grantees */}
      {currentGrantees.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            Current Grantees
            <span className="text-sm font-normal text-muted-foreground">
              (Highest priority - contact NOW for renewal)
            </span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentGrantees.map((opp) => (
              <RelationshipCard key={opp.id} opportunity={opp} type="current_grantee" />
            ))}
          </div>
        </div>
      )}

      {/* Prior Funded */}
      {priorFunded.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-500" />
            Prior Funded
            <span className="text-sm font-normal text-muted-foreground">
              (67-100% historical success rate)
            </span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {priorFunded.map((opp) => (
              <RelationshipCard key={opp.id} opportunity={opp} type="prior_funded" />
            ))}
          </div>
        </div>
      )}

      {/* Prior Contact */}
      {priorContact.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Handshake className="h-5 w-5 text-purple-500" />
            Prior Contact
            <span className="text-sm font-normal text-muted-foreground">
              (Established relationship - follow up)
            </span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {priorContact.map((opp) => (
              <RelationshipCard key={opp.id} opportunity={opp} type="prior_contact" />
            ))}
          </div>
        </div>
      )}

      {/* Strategy Section */}
      <Card>
        <CardHeader>
          <CardTitle>Relationship Leverage Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div className="flex gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 h-fit">
                <Star className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="font-medium">Current Grantees</p>
                <p className="text-muted-foreground">
                  Contact program officers immediately about renewal timelines. These are your
                  highest probability opportunities. Document all outcomes and prepare renewal
                  materials well in advance.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 h-fit">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Prior Funded</p>
                <p className="text-muted-foreground">
                  Reference successful prior partnership in all communications. Highlight
                  organizational growth and new capabilities since last award. Request meetings
                  to discuss new opportunities.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 h-fit">
                <Handshake className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Prior Contact</p>
                <p className="text-muted-foreground">
                  Re-engage contacts with updates on your programs. These relationships may have
                  gone quiet but can be reactivated. Always reference the original connection
                  point.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
