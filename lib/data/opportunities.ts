import path from 'path';
import { cache } from './cache';
import { parseCSV, csvRowToOpportunity } from '../parsers/csv';
import { readMarkdownContent } from '../parsers/markdown';
import { scanOpportunityFolders, getFilesInFolder, fileExists } from './scanner';
import type { Opportunity, GlobalIndex, GlobalStats, Deadline, RelationshipSummary, Priority, Route, FunderType, Status } from '../types';
import { differenceInDays, parseISO, isValid } from 'date-fns';

// Use bundled data in production, allow override via env var for development
const DATA_PATH = process.env.DATA_PATH || path.join(process.cwd(), 'data', 'opportunities');

export async function getAllOpportunities(): Promise<Opportunity[]> {
  return cache.get('all-opportunities', async () => {
    const csvPath = path.join(DATA_PATH, 'ENRICHED-OPPORTUNITIES.csv');

    // Check if CSV exists and use it as primary source
    if (await fileExists(csvPath)) {
      const rows = await parseCSV(csvPath);
      const opportunities: Opportunity[] = [];

      for (const row of rows) {
        const folderId = row.Detail_Folder;
        const folderPath = path.join(DATA_PATH, folderId);

        // Read README if exists
        const readmePath = path.join(folderPath, 'README.md');
        const readme = await fileExists(readmePath)
          ? await readMarkdownContent(readmePath)
          : '';

        // Get files in folder
        const files = await fileExists(folderPath)
          ? await getFilesInFolder(folderPath)
          : [];

        const opportunity = csvRowToOpportunity(row, readme);
        opportunity.files = files;

        opportunities.push(opportunity);
      }

      return opportunities;
    }

    // Fallback: scan folders directly
    const folders = await scanOpportunityFolders(DATA_PATH);
    const opportunities: Opportunity[] = [];

    for (const folder of folders) {
      const folderPath = path.join(DATA_PATH, folder);
      const readmePath = path.join(folderPath, 'README.md');
      const readme = await fileExists(readmePath)
        ? await readMarkdownContent(readmePath)
        : '';

      const files = await getFilesInFolder(folderPath);

      // Create basic opportunity from folder name
      const nameParts = folder.replace(/^\d{3}-/, '').split('-');
      const name = nameParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');

      opportunities.push({
        id: folder,
        name,
        funder: name,
        funderType: 'private_foundation',
        program: 'General Grants',
        amountMin: 0,
        amountMax: 0,
        amountTypical: 0,
        deadlineType: 'rolling',
        deadlineDate: null,
        loiDeadline: null,
        loiRequired: false,
        priority: 'pursue',
        status: 'ready_for_review',
        route: 'route_1_thrive_focused',
        scores: {
          funderAlignment: 0,
          capabilityMatch: 0,
          successProbability: 0,
          strategicValue: 0,
          resourceEfficiency: 0,
        },
        weightedScore: 0,
        priorRelationship: { exists: false, type: 'no_relationship' },
        contacts: [],
        strategicNotes: '',
        folder,
        files,
        readme,
      });
    }

    return opportunities;
  });
}

export async function getOpportunityById(id: string): Promise<Opportunity | null> {
  const opportunities = await getAllOpportunities();
  return opportunities.find(o => o.id === id || o.folder === id) || null;
}

export async function getGlobalIndex(): Promise<GlobalIndex> {
  return cache.get('global-index', async () => {
    const opportunities = await getAllOpportunities();
    const today = new Date();

    // Calculate stats
    const stats = calculateStats(opportunities);

    // Calculate deadlines
    const { upcoming, passed } = calculateDeadlines(opportunities, today);

    // Get rolling opportunities
    const rollingOpportunities = opportunities
      .filter(o => o.deadlineType === 'rolling' && o.status !== 'program_closed')
      .sort((a, b) => b.weightedScore - a.weightedScore)
      .slice(0, 10);

    // Get prior relationships
    const priorRelationships = opportunities
      .filter(o => o.priorRelationship.exists)
      .map(o => ({
        funder: o.funder,
        opportunityId: o.id,
        type: o.priorRelationship.type,
        amount: o.priorRelationship.amount,
        description: o.priorRelationship.description,
      }));

    // Get high priority opportunities
    const highPriorityOpportunities = opportunities
      .filter(o => o.priority === 'high_priority' && o.status !== 'deadline_passed')
      .sort((a, b) => b.weightedScore - a.weightedScore);

    return {
      stats,
      upcomingDeadlines: upcoming,
      passedDeadlines: passed,
      rollingOpportunities,
      priorRelationships,
      highPriorityOpportunities,
    };
  });
}

function calculateStats(opportunities: Opportunity[]): GlobalStats {
  const byPriority: Record<Priority, number> = {
    high_priority: 0,
    pursue: 0,
    opportunistic: 0,
    monitor: 0,
  };

  const byRoute: Record<Route, number> = {
    route_1_thrive_focused: 0,
    route_2_ai_enhanced: 0,
    route_3_ai_healthcare: 0,
    route_4_nhelp_vehicle: 0,
    route_5_sbir_sttr: 0,
    multiple: 0,
  };

  const byFunderType: Record<FunderType, number> = {
    federal: 0,
    private_foundation: 0,
    community_foundation: 0,
    corporate_foundation: 0,
    professional_association: 0,
    nonprofit: 0,
  };

  const byStatus: Record<Status, number> = {
    ready_for_review: 0,
    deadline_passed: 0,
    program_closed: 0,
    in_progress: 0,
  };

  let totalMin = 0;
  let totalMax = 0;

  for (const opp of opportunities) {
    byPriority[opp.priority]++;
    byRoute[opp.route]++;
    byFunderType[opp.funderType]++;
    byStatus[opp.status]++;
    totalMin += opp.amountMin;
    totalMax += opp.amountMax;
  }

  return {
    totalOpportunities: opportunities.length,
    byPriority,
    byRoute,
    byFunderType,
    byStatus,
    totalFunding: { min: totalMin, max: totalMax },
  };
}

function calculateDeadlines(opportunities: Opportunity[], today: Date): { upcoming: Deadline[]; passed: Deadline[] } {
  const upcoming: Deadline[] = [];
  const passed: Deadline[] = [];

  for (const opp of opportunities) {
    // Check main deadline
    if (opp.deadlineDate) {
      const date = parseISO(opp.deadlineDate);
      if (isValid(date)) {
        const daysUntil = differenceInDays(date, today);
        const deadline: Deadline = {
          opportunityId: opp.id,
          opportunityName: opp.name,
          funder: opp.funder,
          date: opp.deadlineDate,
          type: 'full',
          daysUntil,
          isPast: daysUntil < 0,
        };

        if (daysUntil < 0) {
          passed.push(deadline);
        } else {
          upcoming.push(deadline);
        }
      }
    }

    // Check LOI deadline
    if (opp.loiDeadline) {
      const date = parseISO(opp.loiDeadline);
      if (isValid(date)) {
        const daysUntil = differenceInDays(date, today);
        const deadline: Deadline = {
          opportunityId: opp.id,
          opportunityName: opp.name,
          funder: opp.funder,
          date: opp.loiDeadline,
          type: 'loi',
          daysUntil,
          isPast: daysUntil < 0,
        };

        if (daysUntil < 0) {
          passed.push(deadline);
        } else {
          upcoming.push(deadline);
        }
      }
    }
  }

  // Sort upcoming by days until (closest first)
  upcoming.sort((a, b) => a.daysUntil - b.daysUntil);

  // Sort passed by days until (most recent first)
  passed.sort((a, b) => b.daysUntil - a.daysUntil);

  return { upcoming, passed };
}

export async function searchOpportunities(query: string): Promise<Opportunity[]> {
  const opportunities = await getAllOpportunities();
  const lowerQuery = query.toLowerCase();

  return opportunities.filter(opp =>
    opp.name.toLowerCase().includes(lowerQuery) ||
    opp.funder.toLowerCase().includes(lowerQuery) ||
    opp.program.toLowerCase().includes(lowerQuery) ||
    opp.strategicNotes.toLowerCase().includes(lowerQuery) ||
    opp.readme.toLowerCase().includes(lowerQuery)
  );
}

export async function getOpportunityFile(opportunityId: string, filePath: string): Promise<string> {
  const opportunity = await getOpportunityById(opportunityId);
  if (!opportunity) return '';

  const file = opportunity.files.find(f => f.path.endsWith(filePath) || f.name === filePath);
  if (!file) return '';

  if (file.type === 'md') {
    return readMarkdownContent(file.path);
  }

  // For text-based files, read content
  if (['txt', 'yaml', 'yml', 'json', 'csv'].includes(file.type)) {
    const fs = await import('fs/promises');
    try {
      return await fs.readFile(file.path, 'utf-8');
    } catch {
      return '';
    }
  }

  // For other files, return the path (let client handle display)
  return file.path;
}

export async function getOpportunityFileInfo(opportunityId: string, filePath: string): Promise<{ path: string; name: string; type: string } | null> {
  const opportunity = await getOpportunityById(opportunityId);
  if (!opportunity) return null;

  const file = opportunity.files.find(f => f.path.endsWith(filePath) || f.name === filePath);
  if (!file) return null;

  return { path: file.path, name: file.name, type: file.type };
}
