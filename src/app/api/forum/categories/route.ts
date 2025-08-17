// src/app/api/forum/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  console.log('[GET /api/forum/categories]');
  // Example: fetch categories
  const categories = [{ id: 'general', name: 'General Discussion' }];
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  console.log('[POST /api/forum/categories]');
  const data = await req.json();
  // Example: create a new category
  return NextResponse.json(
    { message: 'Category created', category: data },
    { status: 201 }
  );
}
