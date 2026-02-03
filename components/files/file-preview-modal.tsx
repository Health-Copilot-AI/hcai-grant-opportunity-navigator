'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MarkdownRenderer } from '@/components/detail/markdown-renderer';
import { Download, X, Loader2, FileText, ExternalLink } from 'lucide-react';
import type { FileInfo } from '@/lib/types';

interface FilePreviewModalProps {
  file: FileInfo | null;
  opportunityId: string;
  onClose: () => void;
}

export function FilePreviewModal({ file, opportunityId, onClose }: FilePreviewModalProps) {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setContent('');
      setError(null);
      return;
    }

    const loadContent = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = `/api/opportunities/${opportunityId}/file?path=${encodeURIComponent(file.name)}`;
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error('Failed to load file');
        }

        const data = await res.json();
        setContent(data.content || '');
      } catch (err) {
        setError('Unable to load file preview');
        console.error('Failed to load file:', err);
      } finally {
        setLoading(false);
      }
    };

    if (['md', 'txt', 'yaml', 'yml', 'json'].includes(file.type)) {
      loadContent();
    }
  }, [file, opportunityId]);

  const handleDownload = () => {
    if (!file) return;
    const url = `/api/opportunities/${opportunityId}/file?path=${encodeURIComponent(file.name)}&download=true`;
    window.open(url, '_blank');
  };

  const renderContent = () => {
    if (!file) return null;

    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download Instead
          </Button>
        </div>
      );
    }

    // Markdown files
    if (file.type === 'md') {
      return (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <MarkdownRenderer content={content} />
        </div>
      );
    }

    // Plain text, YAML, JSON
    if (['txt', 'yaml', 'yml', 'json'].includes(file.type)) {
      return (
        <pre className="text-sm bg-muted p-4 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono">
          {content}
        </pre>
      );
    }

    // PDF files
    if (file.type === 'pdf') {
      const pdfUrl = `/api/opportunities/${opportunityId}/file?path=${encodeURIComponent(file.name)}&raw=true`;
      return (
        <div className="h-[70vh] bg-muted rounded-lg overflow-hidden">
          <iframe
            src={pdfUrl}
            className="w-full h-full"
            title={file.name}
          />
        </div>
      );
    }

    // Images
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(file.type)) {
      const imageUrl = `/api/opportunities/${opportunityId}/file?path=${encodeURIComponent(file.name)}&raw=true`;
      return (
        <div className="flex items-center justify-center bg-muted/30 rounded-lg p-4">
          <img
            src={imageUrl}
            alt={file.name}
            className="max-w-full max-h-[70vh] object-contain rounded"
          />
        </div>
      );
    }

    // Fallback for unsupported types
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-2">
          Preview not available for this file type
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Download the file to view its contents
        </p>
        <Button variant="outline" onClick={handleDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download File
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={!!file} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between pr-8">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <DialogTitle className="text-lg">{file?.name}</DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs uppercase">
                    {file?.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground capitalize">
                    {file?.category}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="py-4">
            {renderContent()}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
