// src/app/api/users/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
// Potentially import necessary DB functions or models
// import { getUserById } from '@/lib/userActions'; // Example

// Define the interface for the parameters within the context object
// This clearly specifies the shape of `params`
interface RouteParams {
  userId: string;
}

// Define the expected context object structure passed as the second argument
// This uses the RouteParams interface
interface HandlerContext {
  params: RouteParams;
}

// GET Handler for /api/users/[userId]
export async function GET(
  request: NextRequest, // Use NextRequest
  context: HandlerContext // Use the refined context type
): Promise<NextResponse> { // <<< Explicitly define the return type Promise<NextResponse>

  // Destructure userId from context.params
  // TypeScript should correctly infer userId as string here
  const { userId } = context.params;

  // --- Basic Validation (Example) ---
  if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ message: 'Invalid User ID provided' }, { status: 400 });
  }

  console.log(`Fetching data for user ID: ${userId}`); // Logging for debug

  try {
    // --- Your Core Logic ---
    // Example: Fetch user data from your database
    // const user = await getUserById(userId);
    const user = { id: userId, name: `User ${userId}`, email: `user${userId}@example.com` }; // Placeholder data

    if (!user) {
      // If user not found in DB
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // --- Success Response ---
    // Return the fetched user data
    return NextResponse.json(user, { status: 200 });

  } catch (error) {
    // --- Error Handling ---
    console.error(`Error fetching user ${userId}:`, error);
    // Return a generic server error response
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// --- Optional: Add other HTTP method handlers (POST, PUT, DELETE) ---
// export async function PUT(request: NextRequest, context: HandlerContext): Promise<NextResponse> {
//   // ... implementation ...
// }
// export async function DELETE(request: NextRequest, context: HandlerContext): Promise<NextResponse> {
//   // ... implementation ...
// }