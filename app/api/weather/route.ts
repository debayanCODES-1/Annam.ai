import { NextResponse } from 'next/server';
import { MockWeatherProvider } from '../../../lib/adapters/weather';
import { errorResponse, successResponse } from '../../../lib/api/response';

const weatherProvider = new MockWeatherProvider();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const lat = Number(url.searchParams.get('lat') ?? '30.34');
  const lon = Number(url.searchParams.get('lon') ?? '76.38');
  const days = Number(url.searchParams.get('days') ?? '5');

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return NextResponse.json(errorResponse('VALIDATION_ERROR', 'Invalid coordinates'), { status: 400 });
  }

  const current = await weatherProvider.getCurrentWeather({ latitude: lat, longitude: lon });
  const forecast = await weatherProvider.getForecast({ latitude: lat, longitude: lon }, days);
  return NextResponse.json(successResponse({ current, forecast }, 'Weather data loaded'));
}
