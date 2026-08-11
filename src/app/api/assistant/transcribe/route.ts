import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { audioBase64, language } = body;

    // Server-side transcription fallback
    return NextResponse.json({
      transcript: 'నా వరి ఆకులు పసుపు రంగులోకి మారుతున్నాయి. ఏం చేయాలి?',
      detectedLanguage: language || 'te'
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Transcription failed' }, { status: 500 });
  }
}
