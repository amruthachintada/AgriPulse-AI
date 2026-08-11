import { NextRequest, NextResponse } from 'next/server';
import { getWeather } from '@/lib/weather/weather';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get('location') || 'Vijayawada, Andhra Pradesh';

    const weatherData = await getWeather(location);
    return NextResponse.json(weatherData);
  } catch (error: any) {
    console.error('Error in weather API route:', error);
    return NextResponse.json(
      { error: 'Failed to fetch weather information' },
      { status: 500 }
    );
  }
}
