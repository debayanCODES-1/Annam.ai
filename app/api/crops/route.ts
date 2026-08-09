import { NextResponse } from 'next/server';
import { cropCompareSchema } from '../../../lib/validation/schemas';
import { errorResponse, successResponse } from '../../../lib/api/response';
import { recommendCrop } from '../../../lib/calculations/cropRecommendation';

export async function GET() {
  return NextResponse.json(successResponse({ message: 'Crop comparison endpoint is ready' }));
}

export async function POST(request: Request) {
  const body = await request.json();
  const parseResult = cropCompareSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(errorResponse('VALIDATION_ERROR', parseResult.error.message), { status: 400 });
  }

  const result = recommendCrop(parseResult.data);
  return NextResponse.json(successResponse(result, 'Crop recommendation generated'));
}
