// src/app/api/user-applications/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getAuthOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';
import UserApplicationModel from '@/models/UserApplication';
import mongoose from 'mongoose';
import { z } from 'zod';
import { logger } from '@/lib/logger';
import { postDiscordWebhook } from '@/lib/discordWebhook';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const userApplicationSchema = z.object({
  type: z.string({ required_error: 'type is required' }),
  interest: z.string({ required_error: 'interest is required' }),
  about: z.string().optional(),
  interviewAvailability: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id || !mongoose.Types.ObjectId.isValid(session.user.id)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  const userId = new mongoose.Types.ObjectId(session.user.id);
  try {
    const json = await request.json();
    const parsed = userApplicationSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        {
          message: 'Validation Error',
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }
    const { type, interest, about, interviewAvailability } = parsed.data;
    await dbConnect();
    const app = new UserApplicationModel({
      userId,
      type,
      interest,
      about,
      interviewAvailability: interviewAvailability
        ? new Date(interviewAvailability)
        : undefined,
    });
    await app.save();

    const webhookUrl = process.env.DISCORD_APPLICATION_WEBHOOK_URL;
    if (webhookUrl) {
      const lines = [
        `New application from ${session.user?.name || 'unknown user'}`,
        `Type: ${type}`,
        `Interest: ${interest}`,
      ];
      if (about) lines.push(`About: ${about}`);
      if (interviewAvailability)
        lines.push(
          `Interview Availability: ${new Date(
            interviewAvailability
          ).toISOString()}`
        );
      try {
        logger.info('Sending application webhook');
        await postDiscordWebhook(webhookUrl, {
          content: lines.join('\n'),
        });
      } catch (err) {
        logger.error('Failed to send application webhook:', err);
      }
    } else {
      logger.warn('DISCORD_APPLICATION_WEBHOOK_URL not set');
    }

    return NextResponse.json(
      { message: 'Application submitted successfully!' },
      { status: 201 }
    );
  } catch (error) {
    logger.error('User application error:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
