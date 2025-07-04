// src/app/api/applications/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { getAuthOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';
import BotApplicationModel from '@/models/BotApplication'; // Adjust path
import mongoose from 'mongoose';

// Define the expected request body structure
interface ApplicationRequestBody {
    botIdentifier: string;
    serverName?: string;
    serverId?: string;
    reason?: string;
}

export async function POST(request: Request) {
    const session = await getServerSession(getAuthOptions());

    // 1. Check Authentication
    if (!session?.user?.id || !mongoose.Types.ObjectId.isValid(session.user.id)) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const userId = new mongoose.Types.ObjectId(session.user.id);

    try {
        const body = await request.json() as ApplicationRequestBody;

        // 2. Basic Validation
        if (!body.botIdentifier) {
            return NextResponse.json({ message: 'Bot identifier is required' }, { status: 400 });
        }
        // Add more validation as needed (e.g., check bot exists, serverName length)

        await dbConnect();

        // 3. Check for existing application (optional but good practice)
        const existingApplication = await BotApplicationModel.findOne({
            userId: userId,
            botId: body.botIdentifier
        });

        if (existingApplication) {
            return NextResponse.json({ message: 'You have already applied for this bot.' }, { status: 409 }); // 409 Conflict
        }

        // 4. Create and Save New Application
        const newApplication = new BotApplicationModel({
            userId: userId,
            botId: body.botIdentifier,
            serverName: body.serverName,
            serverId: body.serverId,
            reason: body.reason,
            status: 'pending', // Default status
        });

        await newApplication.save();

        // 5. Return Success Response
        return NextResponse.json({ message: 'Application submitted successfully!' }, { status: 201 }); // 201 Created

    } catch (error) {
        console.error("API Application Error:", error);
        if (error instanceof mongoose.Error.ValidationError) {
             return NextResponse.json({ message: 'Validation Error', errors: error.errors }, { status: 400 });
        }
        // Handle potential duplicate key errors if index exists
        if (error instanceof Error && (error as any).code === 11000) {
             return NextResponse.json({ message: 'You have already applied for this bot.' }, { status: 409 });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}