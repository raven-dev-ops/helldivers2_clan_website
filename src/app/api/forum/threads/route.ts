// src/app/api/forum/threads/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  console.log('[GET /api/forum/threads]');
  // Possibly filter by query, e.g., ?categoryId=...
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get('categoryId');
  // Example: fetch threads by category
  const threads = categoryId
    ? [{ id: 1, title: 'Welcome!', categoryId }]
    : [{ id: 2, title: 'Another Thread' }];
  return NextResponse.json(threads);
}

export async function POST(req: NextRequest) {
  console.log('[POST /api/forum/threads]');
  const data = await req.json();
  // Example: create a new thread
  return NextResponse.json({ message: 'Thread created', thread: data }, { status: 201 });
}
