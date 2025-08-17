// src/app/api/leaderboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function GET() {
  logger.info('[GET /api/leaderboard]');
  // Example: fetch top 10 players
  const leaderboard = [
    { rank: 1, name: 'Player1', score: 9999 },
    { rank: 2, name: 'Player2', score: 8500 },
  ];
  return NextResponse.json(leaderboard);
}

export async function POST(req: NextRequest) {
  logger.info('[POST /api/leaderboard]');
  const data = await req.json();
  // Example: update leaderboard with new score
  return NextResponse.json(
    { message: 'Score submitted', data },
    { status: 201 }
  );
}
