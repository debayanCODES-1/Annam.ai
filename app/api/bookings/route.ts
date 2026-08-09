import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../lib/db/prisma';
import { bookingCreateSchema, bookingUpdateSchema } from '../../../lib/validation/schemas';
import { errorResponse, successResponse } from '../../../lib/api/response';

export async function GET() {
  const bookings = await prisma.machineryBooking.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      machinery: true,
      farm: true,
      farmer: true,
    },
  });

  const payload = bookings.map((booking) => ({
    id: booking.id,
    status: booking.status,
    requestedDate: booking.requestedDate.toISOString(),
    acres: booking.acres,
    estimatedCost: booking.estimatedCost,
    farmName: booking.farm.farmName,
    farmerName: booking.farmer.name,
    machineryName: booking.machinery.name,
  }));

  return NextResponse.json(successResponse(payload, 'Booking requests loaded'));
}

export async function POST(request: Request) {
  const body = await request.json();
  const parseResult = bookingCreateSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(errorResponse('VALIDATION_ERROR', parseResult.error.message), { status: 400 });
  }

  const data = {
    ...parseResult.data,
    requestedDate: parseResult.data.requestedDate ? new Date(parseResult.data.requestedDate) : new Date(),
  };

  const created = await prisma.machineryBooking.create({ data });
  return NextResponse.json(successResponse(created, 'Booking request created'));
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const parseResult = bookingUpdateSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(errorResponse('VALIDATION_ERROR', parseResult.error.message), { status: 400 });
  }

  const updated = await prisma.machineryBooking.update({
    where: { id: parseResult.data.id },
    data: { status: parseResult.data.status },
  });

  return NextResponse.json(successResponse(updated, 'Booking status updated'));
}
