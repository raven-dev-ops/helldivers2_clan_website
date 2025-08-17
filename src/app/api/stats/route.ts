// src/app/api/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  console.log('[GET /api/stats]');
  // Example: fetch overall usage or system stats
  const systemStats = { activeUsers: 123, totalPosts: 456 };
  return NextResponse.json(systemStats);
}

export async function POST(req: NextRequest) {
  console.log('[POST /api/stats]');
  const data = await req.json();
  // Example: record a new stat or event
  return NextResponse.json(
    { message: 'Stats recorded', data },
    { status: 201 }
  );
}
