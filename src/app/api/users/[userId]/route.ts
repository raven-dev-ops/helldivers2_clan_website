// src/app/api/users/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
): Promise<NextResponse> {
  const { userId } = await params;

  if (!userId) {
    return NextResponse.json({ message: 'Invalid User ID provided' }, { status: 400 });
  }

  try {
    const user = { id: userId, name: `User ${userId}` };
    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
