// src/app/api/users/profile/last/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/lib/authOptions';
import getMongoClientPromise from '@/lib/mongoClientPromise';
import { ObjectId } from 'mongodb';

export async function GET() {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const client = await getMongoClientPromise();
    const appDb = client.db(process.env.MONGODB_DB || 'GPTHellbot');
    const userObjectId = new ObjectId(session.user.id);

    const doc = await appDb
      .collection('User_Profiles')
      .findOne({ user_id: userObjectId }, { projection: { last_profile: 1 } });

    return NextResponse.json({ last_profile: doc?.last_profile || null });
  } catch (e) {
    return NextResponse.json({ error: 'failed' }, { status: 500 });
  }
}
