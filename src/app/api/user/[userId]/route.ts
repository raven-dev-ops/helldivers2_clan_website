// src/app/api/user/[userId]/route.ts

import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: { userId: string } }
) {
  const { userId } = context.params;

  return NextResponse.json({ userId });
}
