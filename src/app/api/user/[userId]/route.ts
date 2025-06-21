// src/app/api/user/[userId]/route.ts

import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  return NextResponse.json({ userId: params.userId });
}