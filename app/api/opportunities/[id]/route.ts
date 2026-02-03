import { NextResponse } from 'next/server';
import { getOpportunityById } from '@/lib/data/opportunities';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const opportunity = await getOpportunityById(params.id);

    if (!opportunity) {
      return NextResponse.json(
        { error: 'Opportunity not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ opportunity });
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunity' },
      { status: 500 }
    );
  }
}
