// src/app/api/user/[userId]/route.ts

import { NextRequest, NextResponse } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function GET( request: NextRequest, context: any ): Promise<NextResponse> {

  const { userId } = (context as { params: { userId: string } }).params;

  try {
    await dbConnect();
    const user = await User.findById(userId).lean();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}