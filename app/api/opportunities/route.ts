import { NextResponse } from 'next/server';
import { getAllOpportunities, searchOpportunities } from '@/lib/data/opportunities';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  try {
    const opportunities = query
      ? await searchOpportunities(query)
      : await getAllOpportunities();

    return NextResponse.json({ opportunities });
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunities' },
      { status: 500 }
    );
  }
}
