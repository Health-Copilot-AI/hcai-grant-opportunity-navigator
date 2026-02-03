// Core types for Grant Navigator

export type FunderType =
  | 'federal'
  | 'private_foundation'
  | 'community_foundation'
  | 'corporate_foundation'
  | 'professional_association'
  | 'nonprofit';

export type DeadlineType = 'fixed' | 'rolling' | 'annual_cycle' | 'by_invitation';

export type Priority = 'high_priority' | 'pursue' | 'opportunistic' | 'monitor';

export type Status =
  | 'ready_for_review'
  | 'deadline_passed'
  | 'program_closed'
  | 'in_progress';

export type Route =
  | 'route_1_thrive_focused'
  | 'route_2_ai_enhanced'
  | 'route_3_ai_healthcare'
  | 'route_4_nhelp_vehicle'
  | 'route_5_sbir_sttr'
  | 'multiple';

export interface Scores {
  funderAlignment: number;
  capabilityMatch: number;
  successProbability: number;
  strategicValue: number;
  resourceEfficiency: number;
}

export interface PriorRelationship {
  exists: boolean;
  type: 'current_grantee' | 'prior_funded' | 'prior_contact' | 'no_relationship';
  amount?: number;
  description?: string;
}

export interface Contact {
  name?: string;
  email?: string;
  phone?: string;
  notes?: string;
}

export interface FileInfo {
  name: string;
  path: string;
  type: 'md' | 'yaml' | 'pdf' | 'csv' | 'other';
  category: 'readme' | 'research' | 'application' | 'drafts' | 'supporting' | 'root';
}

export interface Opportunity {
  id: string;
  name: string;
  funder: string;
  funderType: FunderType;
  program: string;
  amountMin: number;
  amountMax: number;
  amountTypical: number;
  deadlineType: DeadlineType;
  deadlineDate: string | null;
  loiDeadline: string | null;
  loiRequired: boolean;
  priority: Priority;
  status: Status;
  route: Route;
  scores: Scores;
  weightedScore: number;
  priorRelationship: PriorRelationship;
  contacts: Contact[];
  strategicNotes: string;
  folder: string;
  files: FileInfo[];
  readme: string;
}

export interface Deadline {
  opportunityId: string;
  opportunityName: string;
  funder: string;
  date: string;
  type: 'loi' | 'full' | 'other';
  daysUntil: number;
  isPast: boolean;
}

export interface RelationshipSummary {
  funder: string;
  opportunityId: string;
  type: string;
  amount?: number;
  description?: string;
}

export interface GlobalStats {
  totalOpportunities: number;
  byPriority: Record<Priority, number>;
  byRoute: Record<Route, number>;
  byFunderType: Record<FunderType, number>;
  byStatus: Record<Status, number>;
  totalFunding: {
    min: number;
    max: number;
  };
}

export interface GlobalIndex {
  stats: GlobalStats;
  upcomingDeadlines: Deadline[];
  passedDeadlines: Deadline[];
  rollingOpportunities: Opportunity[];
  priorRelationships: RelationshipSummary[];
  highPriorityOpportunities: Opportunity[];
}

// CSV Row type from ENRICHED-OPPORTUNITIES.csv
export interface CSVOpportunityRow {
  ID: string;
  Opportunity_Name: string;
  Funder: string;
  Funder_Type: string;
  Program_Name: string;
  Min_Amount_USD: string;
  Max_Amount_USD: string;
  Typical_Amount_USD: string;
  Deadline_Type: string;
  Deadline_Date: string;
  LOI_Deadline: string;
  LOI_Required: string;
  Response_Time_Weeks: string;
  Grant_Duration_Months: string;
  Renewable: string;
  Geographic_Focus: string;
  Population_Focus: string;
  Eligibility_Notes: string;
  Application_URL: string;
  Information_URL: string;
  Application_Format: string;
  Portal_Name: string;
  Required_Documents: string;
  Contact_Name: string;
  Contact_Email: string;
  Contact_Phone: string;
  FIU_Prior_Relationship: string;
  Prior_Award_Amount: string;
  Prior_Award_Description: string;
  Recommended_Route: string;
  Score_Funder_Alignment: string;
  Score_Capability_Match: string;
  Score_Success_Probability: string;
  Score_Strategic_Value: string;
  Score_Resource_Efficiency: string;
  Weighted_Score: string;
  Priority_Tier: string;
  Strategic_Notes: string;
  Key_Requirements: string;
  Funding_Priorities: string;
  Status: string;
  Assigned_To: string;
  Internal_Notes: string;
  Detail_Folder: string;
}

// Filter options for the UI
export interface FilterOptions {
  routes: Route[];
  priorities: Priority[];
  funderTypes: FunderType[];
  statuses: Status[];
  hasDeadline: boolean | null;
  hasPriorRelationship: boolean | null;
  searchQuery: string;
}

// Sort options
export type SortField = 'name' | 'weightedScore' | 'deadlineDate' | 'amountMax' | 'funder';
export type SortDirection = 'asc' | 'desc';

export interface SortOptions {
  field: SortField;
  direction: SortDirection;
}
