import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import dbConnect from '@/lib/dbConnect';
import UserModel, { IUser } from '@/models/User';
import mongoose from 'mongoose';
import { ZodError, z } from 'zod';

const ALLOWED_DIVISIONS = ['helldivers-2', 'dune-awakening', 'future0', 'future1', 'future2', 'general'];

const ProfileUpdateSchema = z.object({
  name: z.string().trim().min(2).max(50).optional(),
  email: z.string().trim().toLowerCase().email().optional(),
  division: z.string()
    .refine(val => val === '' || ALLOWED_DIVISIONS.includes(val), {
      message: `Invalid division. Must be empty or one of: ${ALLOWED_DIVISIONS.join(', ')}.`
    })
    .optional(),
}).strict();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.id || !mongoose.Types.ObjectId.isValid(session.user.id)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  await dbConnect();
  const userIdObject = new mongoose.Types.ObjectId(session.user.id);

  if (req.method === 'GET') {
    const user = await UserModel.findById(userIdObject)
      .select('name email image division role createdAt')
      .lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json(user);
  }

  if (req.method === 'PUT') {
    let requestBody = req.body;
    if (typeof requestBody === 'string') requestBody = JSON.parse(requestBody);

    const validationResult = ProfileUpdateSchema.safeParse(requestBody);
    if (!validationResult.success) {
      return res.status(400).json({
        error: "Validation Failed",
        details: validationResult.error.flatten().fieldErrors
      });
    }
    const validatedData = validationResult.data;
    const updatePayload: { $set?: Partial<IUser>, $unset?: { [key: string]: "" } } = {};

    if (validatedData.email) {
      const existingUser = await UserModel.findOne({
        email: validatedData.email,
        _id: { $ne: userIdObject }
      }).lean();
      if (existingUser) {
        return res.status(409).json({
          error: "Validation Failed",
          details: { email: ["Email address is already in use by another account."] }
        });
      }
      if (!updatePayload.$set) updatePayload.$set = {};
      updatePayload.$set.email = validatedData.email;
    }

    if (validatedData.name !== undefined) {
      if (!updatePayload.$set) updatePayload.$set = {};
      updatePayload.$set.name = validatedData.name;
    }

    if (validatedData.division !== undefined) {
      if (validatedData.division === '') {
        if (!updatePayload.$unset) updatePayload.$unset = {};
        updatePayload.$unset.division = "";
      } else {
        if (!updatePayload.$set) updatePayload.$set = {};
        updatePayload.$set.division = validatedData.division;
      }
    }

    if (!updatePayload.$set && !updatePayload.$unset) {
      return res.status(200).json({ success: true, message: 'No changes detected or applied.', updatedFields: {} });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      userIdObject,
      updatePayload,
      { new: true, runValidators: true, select: 'name email division' }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedFieldsList = {
      ...(updatePayload.$set || {}),
      ...(updatePayload.$unset ? { division: null } : {})
    };

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      updatedFields: updatedFieldsList
    });
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
