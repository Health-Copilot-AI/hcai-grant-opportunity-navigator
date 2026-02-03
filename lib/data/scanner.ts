import { promises as fs } from 'fs';
import path from 'path';
import type { FileInfo } from '../types';

export async function scanDirectory(dirPath: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
      .map(entry => entry.name)
      .sort();
  } catch (error) {
    console.error(`Error scanning directory ${dirPath}:`, error);
    return [];
  }
}

export async function scanOpportunityFolders(basePath: string): Promise<string[]> {
  const entries = await scanDirectory(basePath);
  // Filter to only numbered opportunity folders (e.g., 001-xxx, 002-xxx)
  return entries.filter(name => /^\d{3}-/.test(name));
}

export async function getFilesInFolder(folderPath: string): Promise<FileInfo[]> {
  const files: FileInfo[] = [];

  async function scanRecursive(currentPath: string, category: FileInfo['category']) {
    try {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);

        if (entry.isDirectory()) {
          // Map folder names to categories
          const subCategory = getCategoryFromFolder(entry.name);
          await scanRecursive(fullPath, subCategory);
        } else if (entry.isFile() && !entry.name.startsWith('.')) {
          const ext = path.extname(entry.name).toLowerCase();
          const fileType = getFileType(ext);

          // Skip .gitkeep files
          if (entry.name === '.gitkeep') continue;

          files.push({
            name: entry.name,
            path: fullPath,
            type: fileType,
            category: entry.name === 'README.md' ? 'readme' : category,
          });
        }
      }
    } catch (error) {
      console.error(`Error scanning folder ${currentPath}:`, error);
    }
  }

  await scanRecursive(folderPath, 'root');
  return files;
}

function getCategoryFromFolder(folderName: string): FileInfo['category'] {
  const mapping: Record<string, FileInfo['category']> = {
    research: 'research',
    application: 'application',
    drafts: 'drafts',
    'supporting-docs': 'supporting',
  };
  return mapping[folderName.toLowerCase()] || 'root';
}

function getFileType(ext: string): FileInfo['type'] {
  const mapping: Record<string, FileInfo['type']> = {
    '.md': 'md',
    '.yaml': 'yaml',
    '.yml': 'yaml',
    '.pdf': 'pdf',
    '.csv': 'csv',
  };
  return mapping[ext] || 'other';
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function getGlobalFiles(basePath: string): Promise<FileInfo[]> {
  const files: FileInfo[] = [];
  const globalFileNames = [
    'GLOBAL-INDEX.md',
    'TIMELINE.md',
    'PRIOR-RELATIONSHIPS.md',
    'ENRICHED-OPPORTUNITIES.csv',
    'AUDIT-REPORT.md',
  ];

  for (const fileName of globalFileNames) {
    const filePath = path.join(basePath, fileName);
    if (await fileExists(filePath)) {
      const ext = path.extname(fileName).toLowerCase();
      files.push({
        name: fileName,
        path: filePath,
        type: getFileType(ext),
        category: 'root',
      });
    }
  }

  return files;
}
