// src/app/api/forum/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  console.log('[GET /api/forum/posts]');
  // Possibly filter by threadId
  const { searchParams } = new URL(req.url);
  const threadId = searchParams.get('threadId');
  const posts = threadId
    ? [{ id: 1, content: 'Sample post', threadId }]
    : [{ id: 2, content: 'Another post' }];
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  console.log('[POST /api/forum/posts]');
  const data = await req.json();
  // Example: create a new post
  return NextResponse.json(
    { message: 'Post created', post: data },
    { status: 201 }
  );
}
