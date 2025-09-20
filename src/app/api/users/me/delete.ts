import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { ObjectId } from 'mongodb';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import getMongoClientPromise from '@/lib/mongodb';

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const userId = new ObjectId(session.user.id);

  await UserModel.deleteOne({ _id: userId });

  const client = await getMongoClientPromise();
  const db = client.db();
  await Promise.all([
    db.collection('accounts').deleteMany({ userId }),
    db.collection('sessions').deleteMany({ userId }),
    db.collection('verificationTokens').deleteMany({}),
  ]);

  return NextResponse.json({ ok: true });
}
