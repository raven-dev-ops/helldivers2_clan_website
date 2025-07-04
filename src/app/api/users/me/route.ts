// src/app/api/users/me/route.ts
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
  const body = await req.json();
  console.log('Received body:', body);
  return NextResponse.json({ message: 'Updated user', body });
}

// Optional: Add GET for testing
export async function GET() {
  return NextResponse.json({ message: 'GET works!' });
}
