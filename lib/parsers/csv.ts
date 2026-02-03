import Papa from 'papaparse';
import { promises as fs } from 'fs';
import type { CSVOpportunityRow, Opportunity, FunderType, DeadlineType, Priority, Status, Route } from '../types';

export async function parseCSV(filePath: string): Promise<CSVOpportunityRow[]> {
  const content = await fs.readFile(filePath, 'utf-8');
  const result = Papa.parse<CSVOpportunityRow>(content, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });
  return result.data;
}

export function csvRowToOpportunity(row: CSVOpportunityRow, readme: string = ''): Opportunity {
  const parseNumber = (val: string) => {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  };

  const mapFunderType = (type: string): FunderType => {
    const mapping: Record<string, FunderType> = {
      federal: 'federal',
      private_foundation: 'private_foundation',
      community_foundation: 'community_foundation',
      corporate_foundation: 'corporate_foundation',
      professional_association: 'professional_association',
      nonprofit: 'nonprofit',
    };
    return mapping[type.toLowerCase()] || 'private_foundation';
  };

  const mapDeadlineType = (type: string): DeadlineType => {
    const mapping: Record<string, DeadlineType> = {
      fixed: 'fixed',
      rolling: 'rolling',
      annual_cycle: 'annual_cycle',
      by_invitation: 'by_invitation',
    };
    return mapping[type.toLowerCase()] || 'rolling';
  };

  const mapPriority = (tier: string): Priority => {
    const mapping: Record<string, Priority> = {
      high_priority: 'high_priority',
      pursue: 'pursue',
      opportunistic: 'opportunistic',
      monitor: 'monitor',
    };
    return mapping[tier.toLowerCase()] || 'pursue';
  };

  const mapStatus = (status: string): Status => {
    const mapping: Record<string, Status> = {
      ready_for_review: 'ready_for_review',
      deadline_passed: 'deadline_passed',
      program_closed: 'program_closed',
      in_progress: 'in_progress',
    };
    return mapping[status.toLowerCase()] || 'ready_for_review';
  };

  const mapRoute = (route: string): Route => {
    if (route.includes('1') || route.includes('thrive_focused')) return 'route_1_thrive_focused';
    if (route.includes('2') || route.includes('ai_enhanced')) return 'route_2_ai_enhanced';
    if (route.includes('3') || route.includes('ai_healthcare')) return 'route_3_ai_healthcare';
    if (route.includes('4') || route.includes('nhelp')) return 'route_4_nhelp_vehicle';
    if (route.includes('5') || route.includes('sbir')) return 'route_5_sbir_sttr';
    return 'multiple';
  };

  const mapPriorRelationship = (rel: string) => {
    const type = rel.toLowerCase();
    if (type.includes('current')) return { exists: true, type: 'current_grantee' as const };
    if (type.includes('prior_funded') || type.includes('prior funded')) return { exists: true, type: 'prior_funded' as const };
    if (type.includes('prior_contact') || type.includes('prior contact')) return { exists: true, type: 'prior_contact' as const };
    return { exists: false, type: 'no_relationship' as const };
  };

  const priorRel = mapPriorRelationship(row.FIU_Prior_Relationship);

  return {
    id: row.Detail_Folder || row.ID,
    name: row.Opportunity_Name,
    funder: row.Funder,
    funderType: mapFunderType(row.Funder_Type),
    program: row.Program_Name,
    amountMin: parseNumber(row.Min_Amount_USD),
    amountMax: parseNumber(row.Max_Amount_USD),
    amountTypical: parseNumber(row.Typical_Amount_USD),
    deadlineType: mapDeadlineType(row.Deadline_Type),
    deadlineDate: row.Deadline_Date || null,
    loiDeadline: row.LOI_Deadline || null,
    loiRequired: row.LOI_Required?.toLowerCase() === 'yes',
    priority: mapPriority(row.Priority_Tier),
    status: mapStatus(row.Status),
    route: mapRoute(row.Recommended_Route),
    scores: {
      funderAlignment: parseNumber(row.Score_Funder_Alignment),
      capabilityMatch: parseNumber(row.Score_Capability_Match),
      successProbability: parseNumber(row.Score_Success_Probability),
      strategicValue: parseNumber(row.Score_Strategic_Value),
      resourceEfficiency: parseNumber(row.Score_Resource_Efficiency),
    },
    weightedScore: parseNumber(row.Weighted_Score),
    priorRelationship: {
      ...priorRel,
      amount: parseNumber(row.Prior_Award_Amount),
      description: row.Prior_Award_Description,
    },
    contacts: row.Contact_Email ? [{
      name: row.Contact_Name,
      email: row.Contact_Email,
      phone: row.Contact_Phone,
    }] : [],
    strategicNotes: row.Strategic_Notes || '',
    folder: row.Detail_Folder,
    files: [],
    readme,
  };
}
