import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';

export async function GET() {
  await dbConnect();
  const users = await UserModel.find({}, { name: 1, meritPoints: 1 })
    .sort({ meritPoints: -1 })
    .limit(100)
    .lean();
  const results = users.map((u, idx) => ({
    rank: idx + 1,
    player_name: u.name || 'Anonymous',
    meritPoints: u.meritPoints || 0,
  }));
  return NextResponse.json({ results });
}
