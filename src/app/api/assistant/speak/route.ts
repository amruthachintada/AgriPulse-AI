import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    return NextResponse.json({
      success: true,
      text,
      language: 'en',
      locale: 'en-US',
      audioUrl: null
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process TTS request' }, { status: 500 });
  }
}
