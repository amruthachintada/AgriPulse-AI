import { NextRequest, NextResponse } from 'next/server';
import { generateAssistantResponse } from '@/lib/ai/assistant';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, history, context } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query string is required' }, { status: 400 });
    }

    const response = await generateAssistantResponse(query, history || [], context || {});
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Error in assistant chat API route:', error);
    return NextResponse.json(
      { error: 'Failed to process AI assistant query' },
      { status: 500 }
    );
  }
}
