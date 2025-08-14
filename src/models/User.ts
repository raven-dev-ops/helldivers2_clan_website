// src/models/User.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  role: 'user' | 'moderator' | 'admin';
  division?: string | null;

  // OAuth provider info (kept for convenience/lookups)
  provider?: string | null;
  providerAccountId?: string | null;

  // Character / profile fields
  characterHeightCm?: number | null;
  characterWeightKg?: number | null;
  homeplanet?: string | null;
  background?: string | null;
  customAvatarDataUrl?: string | null;
  callsign?: string | null;
  rankTitle?: string | null;
  favoriteWeapon?: string | null;
  armor?: string | null;
  motto?: string | null;
  favoredEnemy?: string | null;
  meritPoints?: number | null;
  twitchUrl?: string | null;

  // Discord
  discordRoles?: Array<{ id: string; name: string }>;

  // Challenge submissions (levels 1..7)
  challengeSubmissions?: Array<{
    level: number; // 1..7
    youtubeUrl?: string | null;
    twitchUrl?: string | null;
    witnessName?: string | null;
    witnessDiscordId?: string | null;
    createdAt?: Date;
  }>;

  // Unit preferences
  preferredHeightUnit?: 'cm' | 'in' | null;
  preferredWeightUnit?: 'kg' | 'lb' | null;

  createdAt: Date;
  updatedAt: Date;
}

const ChallengeSubmissionSchema = new Schema(
  {
    level: { type: Number, required: true, min: 1, max: 7 },
    youtubeUrl: { type: String, default: null },
    twitchUrl: { type: String, default: null },
    witnessName: { type: String, default: null },
    witnessDiscordId: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const DiscordRoleSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    name: { type: String },
    firstName: { type: String, default: null },
    middleName: { type: String, default: null },
    lastName: { type: String, default: null },

    email: { type: String, unique: true, sparse: true, lowercase: true, index: true },
    emailVerified: { type: Date, default: null },
    image: { type: String },

    role: { type: String, enum: ['user', 'moderator', 'admin'], default: 'user', required: true },
    division: { type: String, default: null },

    // Provider fields
    provider: { type: String, index: true, default: null },
    providerAccountId: { type: String, default: null },

    // Character / profile
    characterHeightCm: { type: Number, default: null },
    characterWeightKg: { type: Number, default: null },
    homeplanet: { type: String, default: null },
    background: { type: String, default: null },
    customAvatarDataUrl: { type: String, default: null },
    callsign: { type: String, default: null },
    rankTitle: { type: String, default: null },
    favoriteWeapon: { type: String, default: null },
    armor: { type: String, default: null },
    motto: { type: String, default: null },
    favoredEnemy: { type: String, default: null },
    meritPoints: { type: Number, default: 0 },
    twitchUrl: { type: String, default: null },

    // Discord
    discordRoles: { type: [DiscordRoleSchema], default: [] },

    // Challenges
    challengeSubmissions: { type: [ChallengeSubmissionSchema], default: [] },

    // Units
    preferredHeightUnit: { type: String, enum: ['cm', 'in'], default: 'cm' },
    preferredWeightUnit: { type: String, enum: ['kg', 'lb'], default: 'kg' },
  },
  { timestamps: true }
);

// Avoid model overwrite in Next.js hot-reload
const UserModel: Model<IUser> =
  (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);

export default UserModel;
