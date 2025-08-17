// src/app/api/user-applications/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getAuthOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';
import UserApplicationModel from '@/models/UserApplication';
import mongoose from 'mongoose';
import { logger } from '@/lib/logger';

export async function POST(request: Request) {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id || !mongoose.Types.ObjectId.isValid(session.user.id)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = new mongoose.Types.ObjectId(session.user.id);
  try {
    const body = await request.json();
    const { type, interest, about, interviewAvailability } = body;
    if (!type || !interest) {
      return NextResponse.json(
        { message: 'Type and interest are required' },
        { status: 400 }
      );
    }
    await dbConnect();
    const app = new UserApplicationModel({
      userId,
      type,
      interest,
      about,
      interviewAvailability: interviewAvailability
        ? new Date(interviewAvailability)
        : undefined,
    });
    await app.save();
    return NextResponse.json(
      { message: 'Application submitted successfully!' },
      { status: 201 }
    );
  } catch (error) {
    logger.error('User application error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
