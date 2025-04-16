// src/app/api/users/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface UserRouteParams {
  params: {
    userId: string;
  };
}

// We’ll handle GET, PUT, DELETE as an example
export async function GET(
  _req: NextRequest,
  { params }: UserRouteParams
) {
  console.log(`[GET /api/users/${params.userId}]`);
  const { userId } = params;

  // Example: fetch user from DB
  // const user = await UserModel.findById(userId);
  const user = { id: userId, name: 'Some User' };

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json(user);
}

export async function PUT(
  req: NextRequest,
  { params }: UserRouteParams
) {
  console.log(`[PUT /api/users/${params.userId}]`);
  const { userId } = params;
  const updateData = await req.json();

  // Example: update user in DB
  // await UserModel.findByIdAndUpdate(userId, updateData);

  return NextResponse.json({
    message: `User ${userId} updated`,
    updateData,
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: UserRouteParams
) {
  console.log(`[DELETE /api/users/${params.userId}]`);
  const { userId } = params;

  // Example: delete user in DB
  // await UserModel.findByIdAndDelete(userId);

  return NextResponse.json({ message: `User ${userId} deleted` });
}
