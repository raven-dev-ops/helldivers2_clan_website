// src/app/api/users/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(req: NextRequest) {
  console.log('[GET /api/users/me]');
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized: No user session' },
      { status: 401 }
    );
  }

  // Example: fetch user by session.user.id from DB
  // const userData = await UserModel.findById(session.user.id);
  const userData = { id: session.user.id, name: session.user.name };

  return NextResponse.json(userData);
}

export async function PUT(req: NextRequest) {
  console.log('[PUT /api/users/me]');
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized: No user session' },
      { status: 401 }
    );
  }

  const newData = await req.json();
  // Example: update user by session.user.id in DB
  // await UserModel.findByIdAndUpdate(session.user.id, { ...newData });

  return NextResponse.json({ message: 'Profile updated', newData });
}
