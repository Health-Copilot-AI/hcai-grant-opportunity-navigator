'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  FileSpreadsheet,
  FileImage,
  File,
  Download,
  Eye,
  FolderOpen,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import { FilePreviewModal } from './file-preview-modal';
import type { FileInfo } from '@/lib/types';

interface FileBrowserProps {
  files: FileInfo[];
  opportunityId: string;
}

const fileIcons: Record<string, typeof FileText> = {
  md: FileText,
  txt: FileText,
  pdf: FileText,
  csv: FileSpreadsheet,
  xlsx: FileSpreadsheet,
  xls: FileSpreadsheet,
  png: FileImage,
  jpg: FileImage,
  jpeg: FileImage,
  gif: FileImage,
  yaml: FileText,
  yml: FileText,
  json: FileText,
};

const categoryLabels: Record<string, string> = {
  readme: 'Overview',
  research: 'Research Documents',
  application: 'Application Materials',
  drafts: 'Drafts',
  supporting: 'Supporting Documents',
};

const categoryDescriptions: Record<string, string> = {
  readme: 'Summary and key information',
  research: 'Funder profiles, deep dives, and analysis',
  application: 'Checklists and application guides',
  drafts: 'Work in progress documents',
  supporting: 'Additional reference materials',
};

export function FileBrowser({ files, opportunityId }: FileBrowserProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['research', 'application'])
  );
  const [previewFile, setPreviewFile] = useState<FileInfo | null>(null);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getFileIcon = (file: FileInfo) => {
    const Icon = fileIcons[file.type] || File;
    return Icon;
  };

  const handleDownload = async (file: FileInfo) => {
    const url = `/api/opportunities/${opportunityId}/file?path=${encodeURIComponent(file.name)}&download=true`;
    window.open(url, '_blank');
  };

  const handlePreview = (file: FileInfo) => {
    setPreviewFile(file);
  };

  const categories = ['readme', 'research', 'application', 'drafts', 'supporting'];

  return (
    <>
      <div className="space-y-3">
        {categories.map((category) => {
          const categoryFiles = files.filter((f) => f.category === category);
          if (categoryFiles.length === 0) return null;

          const isExpanded = expandedCategories.has(category);
          const Icon = isExpanded ? ChevronDown : ChevronRight;

          return (
            <Card key={category} className="overflow-hidden">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full text-left"
              >
                <CardHeader className="py-3 px-4 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <FolderOpen className="h-5 w-5 text-amber-500" />
                      <div>
                        <CardTitle className="text-sm font-medium">
                          {categoryLabels[category] || category}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {categoryDescriptions[category]}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {categoryFiles.length} {categoryFiles.length === 1 ? 'file' : 'files'}
                    </Badge>
                  </div>
                </CardHeader>
              </button>

              {isExpanded && (
                <CardContent className="p-0">
                  <div className="divide-y">
                    {categoryFiles.map((file) => {
                      const FileIcon = getFileIcon(file);
                      const canPreview = ['md', 'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'].includes(file.type);

                      return (
                        <div
                          key={file.path}
                          className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors group"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-muted">
                              <FileIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium truncate">{file.name}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs uppercase">
                                  {file.type}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {canPreview && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handlePreview(file)}
                                className="h-8 px-2"
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Preview
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownload(file)}
                              className="h-8 px-2"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      <FilePreviewModal
        file={previewFile}
        opportunityId={opportunityId}
        onClose={() => setPreviewFile(null)}
      />
    </>
  );
}
