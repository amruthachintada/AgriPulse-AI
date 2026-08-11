import { NextRequest, NextResponse } from 'next/server';
import { analyzeCropImage } from '@/lib/ai/vision';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, cropName, location, extraDetails } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: 'Image data is required' }, { status: 400 });
    }

    const result = await analyzeCropImage(
      imageBase64,
      cropName || 'Rice / Paddy',
      location || 'Vijayawada, Andhra Pradesh',
      extraDetails
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in analyze-crop API route:', error);
    return NextResponse.json(
      { error: 'Failed to analyze crop image', details: error?.message },
      { status: 500 }
    );
  }
}
