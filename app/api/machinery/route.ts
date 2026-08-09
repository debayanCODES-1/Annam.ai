import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db/prisma';
import { errorResponse, successResponse } from '../../../lib/api/response';
import { machineryQuerySchema } from '../../../lib/validation/schemas';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = {
    type: url.searchParams.get('type') ?? undefined,
    minPrice: url.searchParams.get('minPrice') ? Number(url.searchParams.get('minPrice')) : undefined,
    maxPrice: url.searchParams.get('maxPrice') ? Number(url.searchParams.get('maxPrice')) : undefined,
    district: url.searchParams.get('district') ?? undefined,
    availabilityStatus: url.searchParams.get('availabilityStatus') ?? undefined,
  };

  const parseResult = machineryQuerySchema.safeParse(query);
  if (!parseResult.success) {
    return NextResponse.json(errorResponse('VALIDATION_ERROR', parseResult.error.message), { status: 400 });
  }

  const filters: any = { where: {} };
  if (parseResult.data.type) filters.where.type = parseResult.data.type;
  if (parseResult.data.district) filters.where.district = parseResult.data.district;
  if (parseResult.data.availabilityStatus) filters.where.availabilityStatus = parseResult.data.availabilityStatus;
  if (parseResult.data.minPrice !== undefined || parseResult.data.maxPrice !== undefined) {
    filters.where.pricePerAcre = {};
    if (parseResult.data.minPrice !== undefined) filters.where.pricePerAcre.gte = parseResult.data.minPrice;
    if (parseResult.data.maxPrice !== undefined) filters.where.pricePerAcre.lte = parseResult.data.maxPrice;
  }

  const machines = await prisma.machinery.findMany(filters);
  return NextResponse.json(successResponse(machines, 'Machinery available'));}
