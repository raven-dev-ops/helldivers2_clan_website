// src/app/api/bots/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  logger.info('[GET /api/bots]');
  // Example: fetch list of bots
  const bots = [{ id: 1, name: 'Example Bot' }];
  return NextResponse.json(bots);
}

export async function POST(req: NextRequest) {
  logger.info('[POST /api/bots]');
  const data = await req.json();
  // Example: create a new bot in database
  return NextResponse.json({ message: 'Bot created', data }, { status: 201 });
}
