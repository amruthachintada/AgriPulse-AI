import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    language: 'en',
    locale: 'en-US',
    confidence: 1.0
  });
}
