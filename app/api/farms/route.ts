import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db/prisma';
import { farmSchema } from '../../../lib/validation/schemas';
import { errorResponse, successResponse } from '../../../lib/api/response';

export async function GET() {
  const farms = await prisma.farm.findMany({ take: 20, orderBy: { createdAt: 'desc' } });
  return NextResponse.json(successResponse(farms, 'Farms loaded'));
}

export async function POST(request: Request) {
  const body = await request.json();
  const parseResult = farmSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(errorResponse('VALIDATION_ERROR', parseResult.error.message), { status: 400 });
  }

  const created = await prisma.farm.create({ data: parseResult.data });
  return NextResponse.json(successResponse(created, 'Farm created'));
}
