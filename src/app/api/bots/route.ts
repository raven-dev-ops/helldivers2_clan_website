// src/app/api/bots/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/logger';

const botSchema = z.object({
  name: z.string().min(1, 'name is required'),
});

export async function GET(req: NextRequest) {
  logger.info('[GET /api/bots]');
  // Example: fetch list of bots
  const bots = [{ id: 1, name: 'Example Bot' }];
  return NextResponse.json(bots);
}

export async function POST(req: NextRequest) {
  logger.info('[POST /api/bots]');
  try {
    const json = await req.json();
    const data = botSchema.parse(json);
    // Example: create a new bot in database
    return NextResponse.json({ message: 'Bot created', data }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid request', errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    logger.error('Error creating bot:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
