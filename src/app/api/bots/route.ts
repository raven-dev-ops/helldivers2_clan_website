// src/app/api/bots/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  console.log('[GET /api/bots]');
  // Example: fetch list of bots
  const bots = [{ id: 1, name: 'Example Bot' }];
  return NextResponse.json(bots);
}

export async function POST(req: NextRequest) {
  console.log('[POST /api/bots]');
  const data = await req.json();
  // Example: create a new bot in database
  return NextResponse.json({ message: 'Bot created', data }, { status: 201 });
}
