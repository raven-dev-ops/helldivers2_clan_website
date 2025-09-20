// src/app/api/users/me/get.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import { buildUserResponse } from './utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CACHE_HEADERS = { 'Cache-Control': 'private, max-age=60' };

export async function GET() {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401, headers: CACHE_HEADERS });
  }

  await dbConnect();

  const user = await UserModel.findById(session.user.id).lean();
  if (!user) {
    return NextResponse.json({ error: 'not_found' }, { status: 404, headers: CACHE_HEADERS });
  }

  // Discord role sync has been disabled. The roles are now read directly from the database.

  return NextResponse.json(buildUserResponse(user), {
    headers: CACHE_HEADERS,
  });
}
