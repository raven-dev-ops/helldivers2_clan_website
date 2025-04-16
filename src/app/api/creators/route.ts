// src/app/api/creators/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  console.log('[GET /api/creators]');
  // Example: retrieve a list of creators
  const creators = [{ id: 1, name: 'John Doe' }];
  return NextResponse.json(creators);
}

export async function POST(req: NextRequest) {
  console.log('[POST /api/creators]');
  const data = await req.json();
  // Example: insert into your Creators DB
  return NextResponse.json({ message: 'Creator added', creator: data }, { status: 201 });
}
