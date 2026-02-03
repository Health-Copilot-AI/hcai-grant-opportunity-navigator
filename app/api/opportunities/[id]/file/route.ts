import { NextResponse } from 'next/server';
import { getOpportunityFile, getOpportunityFileInfo } from '@/lib/data/opportunities';
import fs from 'fs/promises';

const mimeTypes: Record<string, string> = {
  md: 'text/markdown',
  txt: 'text/plain',
  pdf: 'application/pdf',
  csv: 'text/csv',
  json: 'application/json',
  yaml: 'text/yaml',
  yml: 'text/yaml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xls: 'application/vnd.ms-excel',
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get('path');
  const isRaw = searchParams.get('raw') === 'true';
  const isDownload = searchParams.get('download') === 'true';

  if (!filePath) {
    return NextResponse.json(
      { error: 'File path required' },
      { status: 400 }
    );
  }

  try {
    const fileInfo = await getOpportunityFileInfo(params.id, filePath);

    if (!fileInfo) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // For raw or download requests, serve the actual file
    if (isRaw || isDownload) {
      try {
        const fileBuffer = await fs.readFile(fileInfo.path);
        const mimeType = mimeTypes[fileInfo.type] || 'application/octet-stream';

        const headers: Record<string, string> = {
          'Content-Type': mimeType,
          'Cache-Control': 'public, max-age=3600',
        };

        if (isDownload) {
          headers['Content-Disposition'] = `attachment; filename="${fileInfo.name}"`;
        } else {
          headers['Content-Disposition'] = `inline; filename="${fileInfo.name}"`;
        }

        return new NextResponse(fileBuffer, { headers });
      } catch (err) {
        console.error('Error reading file:', err);
        return NextResponse.json(
          { error: 'Failed to read file' },
          { status: 500 }
        );
      }
    }

    // Default: return content as JSON (for text-based files)
    const content = await getOpportunityFile(params.id, filePath);

    if (!content) {
      return NextResponse.json(
        { error: 'File not found or cannot be read' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      content,
      name: fileInfo.name,
      type: fileInfo.type,
    });
  } catch (error) {
    console.error('Error fetching file:', error);
    return NextResponse.json(
      { error: 'Failed to fetch file' },
      { status: 500 }
    );
  }
}
