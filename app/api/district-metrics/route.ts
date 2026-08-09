import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db/prisma';
import { errorResponse, successResponse } from '../../../lib/api/response';

export async function GET() {
  try {
    const metrics = await prisma.districtMetric.findMany({ orderBy: { district: 'asc' } });
    return NextResponse.json(successResponse(metrics, 'District metrics loaded'));
  } catch (error) {
    return NextResponse.json(errorResponse('SERVER_ERROR', 'Failed to load district metrics'), { status: 500 });
  }
}
