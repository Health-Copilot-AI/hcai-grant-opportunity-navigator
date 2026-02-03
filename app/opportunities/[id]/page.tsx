import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getOpportunityById } from '@/lib/data/opportunities';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MarkdownRenderer } from '@/components/detail/markdown-renderer';
import { ScoreRadar } from '@/components/charts/score-radar';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  ExternalLink,
  Mail,
  Phone,
  Star,
  MapPin,
  FileText,
  FolderOpen,
} from 'lucide-react';
import { readMarkdownContent } from '@/lib/parsers/markdown';
import { FileBrowser } from '@/components/files/file-browser';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { id: string };
}

export default async function OpportunityDetailPage({ params }: PageProps) {
  const opportunity = await getOpportunityById(params.id);

  if (!opportunity) {
    notFound();
  }

  const opp = opportunity;

  // Load research files
  const researchFiles = opp.files.filter((f) => f.category === 'research' && f.type === 'md');
  const applicationFiles = opp.files.filter((f) => f.category === 'application' && f.type === 'md');

  // Load content for first research file
  let funderProfileContent = '';
  const funderProfile = researchFiles.find((f) => f.name === 'FUNDER-PROFILE.md');
  if (funderProfile) {
    funderProfileContent = await readMarkdownContent(funderProfile.path);
  }

  let funderDeepDiveContent = '';
  const funderDeepDive = researchFiles.find((f) => f.name === 'FUNDER-DEEP-DIVE.md');
  if (funderDeepDive) {
    funderDeepDiveContent = await readMarkdownContent(funderDeepDive.path);
  }

  let applicationChecklistContent = '';
  const applicationChecklist = applicationFiles.find((f) => f.name === 'APPLICATION-CHECKLIST.md');
  if (applicationChecklist) {
    applicationChecklistContent = await readMarkdownContent(applicationChecklist.path);
  }

  const formatAmount = (min: number, max: number) => {
    if (max === 0) return 'TBD';
    const formatNum = (n: number) => {
      if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
      return `$${(n / 1000).toFixed(0)}K`;
    };
    if (min === max) return formatNum(max);
    return `${formatNum(min)} - ${formatNum(max)}`;
  };

  const getStatusColor = () => {
    switch (opp.status) {
      case 'deadline_passed':
      case 'program_closed':
        return 'bg-gray-500';
      case 'in_progress':
        return 'bg-blue-500';
      default:
        return opp.deadlineType === 'rolling' ? 'bg-green-500' : 'bg-amber-500';
    }
  };

  const getStatusLabel = () => {
    switch (opp.status) {
      case 'deadline_passed':
        return 'Deadline Passed';
      case 'program_closed':
        return 'Program Closed';
      case 'in_progress':
        return 'In Progress';
      default:
        return opp.deadlineType === 'rolling' ? 'Rolling' : 'Active';
    }
  };

  const routeLabels: Record<string, string> = {
    route_1_thrive_focused: 'Route 1: Thrive-Focused',
    route_2_ai_enhanced: 'Route 2: AI-Enhanced',
    route_3_ai_healthcare: 'Route 3: AI+Healthcare',
    route_4_nhelp_vehicle: 'Route 4: NHELP Vehicle',
    route_5_sbir_sttr: 'Route 5: SBIR/STTR',
    multiple: 'Multiple Routes',
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/opportunities">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Opportunities
        </Button>
      </Link>

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {opp.priorRelationship.exists && (
              <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
            )}
            <h1 className="text-2xl font-bold">{opp.name}</h1>
          </div>
          <p className="text-lg text-muted-foreground">{opp.funder}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge className={`${getStatusColor()} text-white`}>
              {getStatusLabel()}
            </Badge>
            <Badge variant="outline">{routeLabels[opp.route]}</Badge>
            {opp.priorRelationship.exists && (
              <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/20 border-amber-200">
                {opp.priorRelationship.type.replace('_', ' ')}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {opp.weightedScore.toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">Weighted Score</p>
        </div>
      </div>

      {/* Quick Facts Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="font-semibold">{formatAmount(opp.amountMin, opp.amountMax)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Deadline</p>
                <p className="font-semibold">
                  {opp.deadlineDate || opp.deadlineType.replace('_', ' ')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">LOI Required</p>
                <p className="font-semibold">{opp.loiRequired ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <FolderOpen className="h-5 w-5 text-amber-500" />
              <div>
                <p className="text-sm text-muted-foreground">Funder Type</p>
                <p className="font-semibold capitalize">
                  {opp.funderType.replace('_', ' ')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="research">Research</TabsTrigger>
              <TabsTrigger value="application">Application</TabsTrigger>
              <TabsTrigger value="files">Files</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  {opp.readme ? (
                    <MarkdownRenderer content={opp.readme} />
                  ) : (
                    <p className="text-muted-foreground">No README content available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="research" className="mt-4 space-y-4">
              {funderProfileContent && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Funder Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MarkdownRenderer content={funderProfileContent} />
                  </CardContent>
                </Card>
              )}
              {funderDeepDiveContent && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Deep Dive</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <MarkdownRenderer content={funderDeepDiveContent} />
                  </CardContent>
                </Card>
              )}
              {!funderProfileContent && !funderDeepDiveContent && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">No research documents available</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="application" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  {applicationChecklistContent ? (
                    <MarkdownRenderer content={applicationChecklistContent} />
                  ) : (
                    <p className="text-muted-foreground">No application checklist available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="files" className="mt-4">
              {opp.files.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground">No files available</p>
                  </CardContent>
                </Card>
              ) : (
                <FileBrowser files={opp.files} opportunityId={opp.id} />
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Score Radar */}
          <ScoreRadar scores={opp.scores} weightedScore={opp.weightedScore} />

          {/* Contacts */}
          {opp.contacts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {opp.contacts.map((contact, i) => (
                  <div key={i} className="space-y-2">
                    {contact.name && (
                      <p className="font-medium">{contact.name}</p>
                    )}
                    {contact.email && (
                      <a
                        href={`mailto:${contact.email}`}
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <Mail className="h-4 w-4" />
                        {contact.email}
                      </a>
                    )}
                    {contact.phone && (
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        {contact.phone}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Strategic Notes */}
          {opp.strategicNotes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Strategic Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{opp.strategicNotes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
