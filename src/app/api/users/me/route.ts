// src/app/api/users/me/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next'; // Use next-auth/next for App Router
// --- ADJUST THIS IMPORT PATH ---
// Ensure this points to the file where your AuthOptions are configured
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Or '@/lib/authOptions', etc.
// --- ADJUST OTHER IMPORT PATHS ---
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/User';
import mongoose from 'mongoose';

// --- GET Handler: Fetch Current User's Data ---
export async function GET(req: NextRequest) {
  console.log('[GET /api/users/me] - Fetching current user data');
  const session = await getServerSession(authOptions);

  // 1. Check for active session and user ID
  if (!session?.user?.id) {
    console.log('[GET /api/users/me] - Unauthorized: No active session.');
    return NextResponse.json({ error: 'Unauthorized: No active session' }, { status: 401 });
  }

  // 2. Validate session user ID format (important before DB query)
  if (!mongoose.Types.ObjectId.isValid(session.user.id)) {
      console.error(`[GET /api/users/me] - Invalid user ID format in session: ${session.user.id}`);
      // Return 401 here too, as the session data itself is invalid for DB lookup
      return NextResponse.json({ error: 'Unauthorized: Invalid session data' }, { status: 401 });
  }

  try {
    await dbConnect(); // 3. Connect to database

    // 4. Fetch user from DB using the validated session ID
    const userIdObject = new mongoose.Types.ObjectId(session.user.id);
    const user = await UserModel.findById(userIdObject)
      .select('name email image division role createdAt') // Select only necessary fields
      .lean(); // Use lean for performance

    // 5. Handle user not found in DB
    if (!user) {
        console.log(`[GET /api/users/me] - User not found in DB: ${session.user.id}`);
        // This could indicate DB inconsistency or deleted user, treat as error
        return NextResponse.json({ error: 'User associated with session not found' }, { status: 404 });
    }

    // 6. Return found user data
    console.log(`[GET /api/users/me] - Returning data for user: ${session.user.id}`);
    return NextResponse.json(user, { status: 200 });

  } catch (error) {
     // 7. Handle generic server errors
     console.error("[GET /api/users/me] - Database or server error:", error);
     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


// --- PUT Handler: Update User Profile/Division ---
export async function PUT(req: NextRequest) {
  console.log('[PUT /api/users/me] - Attempting to update user profile/division');
  // 1. --- Verify Session ---
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    console.log('[PUT /api/users/me] - Unauthorized: No user session.');
    return NextResponse.json({ error: 'Unauthorized: No user session' }, { status: 401 });
  }

   // 2. Validate session user ID format
  if (!mongoose.Types.ObjectId.isValid(session.user.id)) {
      console.error(`[PUT /api/users/me] - Invalid user ID format in session: ${session.user.id}`);
      return NextResponse.json({ error: 'Unauthorized: Invalid session data' }, { status: 401 });
  }

  try {
    await dbConnect(); // 3. Ensure DB connection

    const body = await req.json();
    const { division, name, email } = body; // Extract potential fields to update

    // 4. --- Prepare and Validate Update Data ---
    const updateData: { [key: string]: any } = {};
    const validationErrors: { [key: string]: string } = {};

    if (division !== undefined) {
        if (typeof division === 'string' && division.length > 0) { // Basic validation
            // TODO: Add specific validation if division must be one of specific values
            updateData.division = division;
        } else {
            validationErrors.division = "Division must be a non-empty string.";
        }
    }
    if (name !== undefined) {
        if (typeof name === 'string' && name.trim().length >= 2) {
            updateData.name = name.trim();
        } else {
            validationErrors.name = "Name must be at least 2 characters.";
        }
    }
    if (email !== undefined) {
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
         if (typeof email === 'string' && emailRegex.test(email)) {
             updateData.email = email.toLowerCase().trim();
             // TODO: Check if email already exists for another user if it needs to be unique
         } else {
             validationErrors.email = "Invalid email format.";
         }
    }

    // If validation errors occurred, return Bad Request
    if (Object.keys(validationErrors).length > 0) {
        console.log("[PUT /api/users/me] - Validation errors:", validationErrors);
        return NextResponse.json({ error: "Validation Failed", details: validationErrors }, { status: 400 });
    }

    // Check if there's anything actually to update after validation
    if (Object.keys(updateData).length === 0) {
        console.log("[PUT /api/users/me] - No valid update data provided.");
        return NextResponse.json({ error: 'No valid update data provided' }, { status: 400 });
    }

    // 5. --- Perform Database Update ---
    const userIdObject = new mongoose.Types.ObjectId(session.user.id);

    const updatedUser = await UserModel.findByIdAndUpdate(
      userIdObject, // Use the validated & converted ObjectId
      { $set: updateData },
      { new: true, runValidators: true, select: 'name email division' } // Ensure schema validation runs
    );

    // 6. Handle user not found during update
    if (!updatedUser) {
      console.log(`[PUT /api/users/me] - User not found during update: ${session.user.id}`);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 7. Return success response
    console.log(`[PUT /api/users/me] - User ${userIdObject} updated successfully. Fields:`, Object.keys(updateData));
    return NextResponse.json({
        success: true,
        message: 'Profile updated successfully',
        updatedFields: updateData
    }, { status: 200 });

  } catch (error) {
    // 8. --- Handle Errors ---
    console.error("[PUT /api/users/me] - Error during update process:", error);
    if (error instanceof mongoose.Error.ValidationError) {
        return NextResponse.json({ error: "Validation Error from DB", details: error.errors }, { status: 400 });
    }
    // Handle potential duplicate key errors (e.g., if email is unique)
    // Example check (may vary based on MongoDB driver version)
    // if (error.code === 11000 && error.keyPattern?.email) {
    //    console.log(`[PUT /api/users/me] - Duplicate email attempt: ${updateData.email}`);
    //    return NextResponse.json({ error: "Email already in use." }, { status: 409 }); // 409 Conflict
    // }
    // Generic server error for other issues
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}