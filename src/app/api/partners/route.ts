// src/app/api/partners/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  console.log('[GET /api/partners]');
  // Example: return partner list
  const partners = [{ id: '1', name: 'Big Gaming Co.' }];
  return NextResponse.json(partners);
}

export async function POST(req: NextRequest) {
  console.log('[POST /api/partners]');
  const data = await req.json();
  // Example: add a new partner
  return NextResponse.json({ message: 'Partner created', partner: data }, { status: 201 });
}
