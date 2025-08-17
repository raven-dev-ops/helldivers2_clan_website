// src/app/api/store/rotation/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import StoreRotation from '@/models/StoreRotation';
import StoreItem from '@/models/StoreItem';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/lib/authOptions';

export const revalidate = 300;

export async function GET() {
  try {
    await dbConnect();

    const now = new Date();
    const rotation = await StoreRotation.findOne({
      starts_at: { $lte: now },
      ends_at: { $gte: now },
    }).lean();

    if (!rotation) {
      return NextResponse.json(
        { rotation: null },
        { headers: { 'Cache-Control': 's-maxage=60' } }
      );
    }

    const items = await StoreItem.find({ _id: { $in: rotation.items } }).lean();

    return NextResponse.json(
      { rotation, items },
      {
        headers: {
          'Cache-Control': 's-maxage=300, stale-while-revalidate=300',
        },
      }
    );
  } catch {
    const sample = {
      rotation: {
        starts_at: new Date().toISOString(),
        ends_at: new Date(Date.now() + 86400000).toISOString(),
      },
      items: [
        {
          _id: '1',
          name: 'Placeholder Cape',
          type: 'cosmetic',
          price_sc: 100,
          image_url: '/images/placeholder.png',
        },
      ],
    };
    return NextResponse.json(sample, {
      headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=300' },
    });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(getAuthOptions());
    if (!session)
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    await dbConnect();

    const body = await request.json();
    const { starts_at, ends_at, items, source = 'admin', notes } = body ?? {};

    if (!starts_at || !ends_at || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
    }

    const rotationDoc = await StoreRotation.create({
      starts_at: new Date(starts_at),
      ends_at: new Date(ends_at),
      items,
      source,
      notes,
    });

    return NextResponse.json({ rotation: rotationDoc }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'unexpected' }, { status: 500 });
  }
}
