import { NextResponse } from 'next/server';
import { getGlobalIndex } from '@/lib/data/opportunities';

export async function GET() {
  try {
    const globalIndex = await getGlobalIndex();
    return NextResponse.json(globalIndex);
  } catch (error) {
    console.error('Error fetching global index:', error);
    return NextResponse.json(
      { error: 'Failed to fetch global index' },
      { status: 500 }
    );
  }
}
