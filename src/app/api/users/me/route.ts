// src/app/api/users/me/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions'; // Assuming centralized options
import dbConnect from '@/lib/dbConnect';
import UserModel, { IUser } from '@/models/User';
import mongoose from 'mongoose';
import { ZodError, z } from 'zod'; // Import Zod for robust validation

// --- Define Allowed Divisions (Centralize if used elsewhere) ---
const ALLOWED_DIVISIONS = ['helldivers-2', 'dune-awakening', 'future0', 'future1', 'future2', 'general']; // Example list

// --- Validation Schemas (using Zod) ---
const ProfileUpdateSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name cannot exceed 50 characters.")
    .optional(), // Make fields optional for partial updates
  email: z.string()
    .trim()
    .toLowerCase()
    .email("Invalid email format.")
    .optional(),
  division: z.string()
    .refine(val => val === '' || ALLOWED_DIVISIONS.includes(val), { // Allow empty string or value from list
      message: `Invalid division. Must be empty or one of: ${ALLOWED_DIVISIONS.join(', ')}.`
    })
    .optional(),
}).strict(); // Disallow extra fields in the body

// --- GET Handler: Fetch Current User's Data ---
export async function GET(req: NextRequest) {
  console.log('[GET /api/users/me] - Request received');
  const session = await getServerSession(authOptions);

  // Validate Session and ID
  if (!session?.user?.id || !mongoose.Types.ObjectId.isValid(session.user.id)) {
    console.log('[GET /api/users/me] - Unauthorized: Invalid or missing session/user ID.');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const userIdObject = new mongoose.Types.ObjectId(session.user.id); // Already validated

    const user = await UserModel.findById(userIdObject)
      .select('name email image division role createdAt') // Select fields to expose
      .lean();

    if (!user) {
        console.log(`[GET /api/users/me] - User not found in DB: ${session.user.id}`);
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log(`[GET /api/users/me] - Returning data for user: ${session.user.id}`);
    return NextResponse.json(user, { status: 200 });

  } catch (error) {
     console.error("[GET /api/users/me] - Server error:", error);
     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


// --- PUT Handler: Update User Profile/Division ---
export async function PUT(req: NextRequest) {
  console.log('[PUT /api/users/me] - Request received');
  let requestBody: any; // To hold body for potential error logging

  // 1. Verify Session and User ID
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !mongoose.Types.ObjectId.isValid(session.user.id)) {
    console.log('[PUT /api/users/me] - Unauthorized: Invalid or missing session/user ID.');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const currentUserId = new mongoose.Types.ObjectId(session.user.id); // Convert validated ID

  try {
    await dbConnect(); // 2. Connect to DB

    requestBody = await req.json(); // 3. Parse request body

    // 4. Validate Request Body using Zod
    const validationResult = ProfileUpdateSchema.safeParse(requestBody);
    if (!validationResult.success) {
        console.log("[PUT /api/users/me] - Zod validation errors:", validationResult.error.flatten());
        return NextResponse.json({
            error: "Validation Failed",
            details: validationResult.error.flatten().fieldErrors
        }, { status: 400 }); // Bad Request
    }

    const validatedData = validationResult.data; // Data is now type-safe and validated

    // 5. Prepare Update Payload (handle optional fields and email uniqueness)
    const updatePayload: { $set?: Partial<IUser>, $unset?: { [key: string]: "" } } = {};

    // Check email uniqueness *only* if email is being updated
    if (validatedData.email) {
      const existingUser = await UserModel.findOne({
        email: validatedData.email, // Already normalized by Zod schema potentially
        _id: { $ne: currentUserId }
      }).lean();

      if (existingUser) {
        console.log(`[PUT /api/users/me] - Email uniqueness check failed for: ${validatedData.email}`);
        // Return specific validation error for email field
        return NextResponse.json({
            error: "Validation Failed",
            details: { email: ["Email address is already in use by another account."] }
        }, { status: 409 }); // 409 Conflict is appropriate
      }
      // If unique, add to $set
      if (!updatePayload.$set) updatePayload.$set = {};
      updatePayload.$set.email = validatedData.email;
    }

    // Add name if provided
    if (validatedData.name !== undefined) {
       if (!updatePayload.$set) updatePayload.$set = {};
       updatePayload.$set.name = validatedData.name;
    }

    // Add or remove division
    if (validatedData.division !== undefined) {
       if (validatedData.division === '') { // Check for empty string to unset
           if (!updatePayload.$unset) updatePayload.$unset = {};
           updatePayload.$unset.division = "";
       } else {
           if (!updatePayload.$set) updatePayload.$set = {};
           updatePayload.$set.division = validatedData.division;
       }
    }

    // 6. Check if there's actually anything to update
    if (!updatePayload.$set && !updatePayload.$unset) {
      console.log("[PUT /api/users/me] - No changes to apply after validation.");
      return NextResponse.json({ success: true, message: 'No changes detected or applied.', updatedFields: {} }, { status: 200 });
    }

    // 7. Perform Database Update
    const updatedUser = await UserModel.findByIdAndUpdate(
      currentUserId,
      updatePayload, // Pass the structured $set/$unset payload
      { new: true, runValidators: true, select: 'name email division' } // Options
    );

    // 8. Handle User Not Found During Update
    if (!updatedUser) {
      console.log(`[PUT /api/users/me] - User not found during update: ${session.user.id}`);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 9. Return Success Response
    console.log(`[PUT /api/users/me] - User ${currentUserId} updated successfully.`);
    // Construct a simplified list of what was intended to be updated
    const updatedFieldsList = {
        ...(updatePayload.$set || {}),
        ...(updatePayload.$unset ? { division: null } : {}) // Indicate division removal
    };
    return NextResponse.json({
        success: true,
        message: 'Profile updated successfully',
        updatedFields: updatedFieldsList
    }, { status: 200 });

  } catch (error: any) {
    // 10. Handle Potential Errors
    console.error("[PUT /api/users/me] - Error during update process:", error);

    // Zod validation errors (should be caught earlier, but good practice)
    if (error instanceof ZodError) {
        return NextResponse.json({ error: "Validation Failed", details: error.flatten().fieldErrors }, { status: 400 });
    }
    // Mongoose schema validation errors (if runValidators catches something Zod missed)
    if (error instanceof mongoose.Error.ValidationError) {
        return NextResponse.json({ error: "Database Validation Error", details: error.errors }, { status: 400 });
    }
    // MongoDB duplicate key errors (fallback for email uniqueness)
    if (error.code === 11000 && error.keyPattern?.email && requestBody?.email) {
       console.log(`[PUT /api/users/me] - Duplicate email caught by DB index: ${requestBody.email}`);
       return NextResponse.json({ error: "Validation Failed", details: { email: ["Email address is already in use."] } }, { status: 409 });
    }
    // BSONError (should be less likely now with checks)
    if (error.name === 'BSONError' && error.message?.includes('ObjectId')) {
        console.error("[PUT /api/users/me] - BSONError:", session?.user?.id, error);
        return NextResponse.json({ error: "Internal Server Error - Invalid ID format issue" }, { status: 500 });
    }
    // Generic fallback
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}