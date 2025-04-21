// src/app/api/users/me/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/dbConnect';
import UserModel, { IUser } from '@/models/User';
import mongoose from 'mongoose';

const ALLOWED_DIVISIONS = ['helldivers-2', 'dune-awakening', 'future0', 'future1', 'future2', 'general'];

// --- GET Handler ---
export async function GET(req: NextRequest) {
  console.log('[GET /api/users/me] - Fetching current user data');
  const session = await getServerSession(authOptions);

  // --- FIX 1: Stricter check for session and session.user.id ---
  if (!session?.user?.id) { // This checks session, session.user, and session.user.id
    console.log('[GET /api/users/me] - Unauthorized: No active session or user ID found.');
    return NextResponse.json({ error: 'Unauthorized: No active session' }, { status: 401 });
  }
  // --- End Fix 1 ---

  // --- FIX 2: Check validity *after* confirming session.user.id exists ---
  if (!mongoose.Types.ObjectId.isValid(session.user.id)) {
      console.error(`[GET /api/users/me] - Invalid user ID format in session: ${session.user.id}`);
      return NextResponse.json({ error: 'Unauthorized: Invalid session data' }, { status: 401 });
  }
  // --- End Fix 2 ---

  try {
    await dbConnect();

    // --- FIX 3: Use non-null assertion (!) as we've checked session.user.id exists ---
    const userIdObject = new mongoose.Types.ObjectId(session.user.id!);
    // --- End Fix 3 ---

    const user = await UserModel.findById(userIdObject)
      .select('name email image division role createdAt')
      .lean();

    if (!user) {
        console.log(`[GET /api/users/me] - User not found in DB: ${session.user.id}`);
        return NextResponse.json({ error: 'User associated with session not found' }, { status: 404 });
    }

    console.log(`[GET /api/users/me] - Returning data for user: ${session.user.id}`);
    return NextResponse.json(user, { status: 200 });

  } catch (error) {
     console.error("[GET /api/users/me] - Database or server error:", error);
     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


// --- PUT Handler ---
export async function PUT(req: NextRequest) {
  console.log('[PUT /api/users/me] - Attempting to update user profile/division');
  let body: Partial<IUser & { division: string }> = {};

  const session = await getServerSession(authOptions);

  // --- FIX 1: Stricter check for session and session.user.id ---
  if (!session?.user?.id) {
    console.log('[PUT /api/users/me] - Unauthorized: No user session or user ID found.');
    return NextResponse.json({ error: 'Unauthorized: No user session' }, { status: 401 });
  }
  // --- End Fix 1 ---

  // --- FIX 2: Check validity *after* confirming session.user.id exists ---
  if (!mongoose.Types.ObjectId.isValid(session.user.id)) {
      console.error(`[PUT /api/users/me] - Invalid user ID format in session: ${session.user.id}`);
      return NextResponse.json({ error: 'Unauthorized: Invalid session data' }, { status: 401 });
  }
  // --- End Fix 2 ---

  // --- FIX 3: Use non-null assertion (!) as we've checked session.user.id exists ---
  const currentUserIdString = session.user.id!; // Store the non-null string
  const currentUserId = new mongoose.Types.ObjectId(currentUserIdString); // Convert
  // --- End Fix 3 ---


  try {
    await dbConnect();
    body = await req.json();
    const { division, name, email } = body;
    const updatePayload: { $set?: Partial<IUser>, $unset?: { [key: string]: "" } } = {};
    const validationErrors: { [key: string]: string } = {};

    // --- Validate Division ---
    if (division !== undefined) { /* ... validation logic ... */ }

    // --- Validate Name ---
    if (name !== undefined) { /* ... validation logic ... */ }

    // --- Validate and Check Email Uniqueness ---
    if (email !== undefined) {
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         const normalizedEmail = email.toLowerCase().trim();
         if (typeof email === 'string' && emailRegex.test(normalizedEmail)) {
            // Use the ObjectId we already created and validated
            const existingUser = await UserModel.findOne({
                email: normalizedEmail,
                _id: { $ne: currentUserId } // Use the ObjectId here
             }).lean();
            if (existingUser) {
                 validationErrors.email = "Email address is already in use by another account.";
            } else {
                 if (!updatePayload.$set) updatePayload.$set = {};
                 updatePayload.$set.email = normalizedEmail;
            }
         } else {
             validationErrors.email = "Invalid email format.";
         }
    }

    // --- Return validation errors if any ---
    if (Object.keys(validationErrors).length > 0) { /* ... return 400 ... */ }

    // --- Check if there's data to update ---
    if (!updatePayload.$set && !updatePayload.$unset) { /* ... return 200 (no changes) ... */ }

    // --- Perform Database Update ---
    const updatedUser = await UserModel.findByIdAndUpdate(
      currentUserId, // Use the ObjectId
      updatePayload,
      { new: true, runValidators: true, select: 'name email division' }
    );

    if (!updatedUser) { /* ... return 404 ... */ }

    // --- Success ---
    console.log(`[PUT /api/users/me] - User ${currentUserId} updated successfully.`);
    const updatedFieldsList = { ...updatePayload.$set, ...(updatePayload.$unset ? { division: null } : {}) };
    return NextResponse.json({ success: true, message: 'Profile updated', updatedFields: updatedFieldsList }, { status: 200 });

  } catch (error: any) {
    // --- Error Handling (check BSONError by name) ---
    console.error("[PUT /api/users/me] - Error during update process:", error);
    if (error instanceof mongoose.Error.ValidationError) { /* ... return 400 ... */ }
    if (error.code === 11000 && error.keyPattern?.email && body?.email) { /* ... return 409 ... */ }
    // Use error.name to check for BSONError
    if (error.name === 'BSONError' && error.message?.includes('ObjectId')) {
        console.error("[PUT /api/users/me] - BSONError:", session?.user?.id, error);
        return NextResponse.json({ error: "Internal Server Error - Invalid ID format issue" }, { status: 500 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}