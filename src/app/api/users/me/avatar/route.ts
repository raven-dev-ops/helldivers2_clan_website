// src/app/api/users/me/avatar/route.ts

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';

export async function GET() {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const user = await UserModel.findById(session.user.id)
    .select('customAvatarDataUrl image updatedAt')
    .lean();

  // If you store a data URL, return it as plain text so the client can set <img src=...>
  if (user?.customAvatarDataUrl?.startsWith('data:')) {
    return new NextResponse(user.customAvatarDataUrl, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'private, max-age=300, stale-while-revalidate=600',
        'ETag': `"${(user.updatedAt ?? '').valueOf()}"`,
      },
    });
  }

  // Fallback to hosted image URL (client can use this directly)
  return NextResponse.json(
    { image: user?.image ?? null },
    {
      status: 200,
      headers: {
        'Cache-Control': 'private, max-age=300, stale-while-revalidate=600',
      },
    }
  );
}
