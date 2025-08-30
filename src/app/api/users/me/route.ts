--- a/src/app/api/users/me/route.ts
+++ b/src/app/api/users/me/route.ts
- export { GET } from './get';
- export { PUT } from './put';
- export { DELETE } from './delete';
+ // Single-source handlers; no re-exports so Next can pick method exports cleanly.
+ export const runtime = 'nodejs';

 import { NextResponse } from 'next/server';
 import { getServerSession } from 'next-auth';
 import { getAuthOptions } from '@/lib/authOptions';
 import dbConnect from '@/lib/dbConnect';
 import UserModel from '@/models/User';
 import getMongoClientPromise from '@/lib/mongoClientPromise';
 import { ObjectId } from 'mongodb';
 import { logger } from '@/lib/logger';
 const userCache = new Map<string, { data: Record<string, unknown>; expires: number }>();

 export async function GET() {
   const session = await getServerSession(getAuthOptions());
   if (!session?.user?.id) {
     return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
   }

   const now = Date.now();
   const cached = userCache.get(session.user.id);
   if (cached && cached.expires > now) {
-    return NextResponse.json(cached.data, {
-      headers: { 'Cache-Control': 'private, max-age=60' },
-    });
+    return NextResponse.json(cached.data, {
+      headers: { 'Cache-Control': 'private, max-age=60', 'Vary': 'Cookie' },
+    });
   }

   await dbConnect();
-  const user = await UserModel.findById(session.user.id).lean();
+  // Project only the fields you return (smaller/faster)
+  const user = await UserModel.findById(session.user.id)
+    .select([
+      'name','firstName','middleName','lastName','email','image','division',
+      'characterHeightCm','characterWeightKg','homeplanet','background',
+      'customAvatarDataUrl','callsign','rankTitle','favoriteWeapon','armor',
+      'motto','favoredEnemy','meritPoints','twitchUrl',
+      'preferredHeightUnit','preferredWeightUnit','discordRoles',
+      'challengeSubmissions','createdAt','updatedAt'
+    ].join(' '))
+    .lean();
   if (!user) return NextResponse.json({ error: 'not_found' }, { status: 404 });

   const data = {
     id: user._id.toString(),
     name: user.name,
     firstName: user.firstName ?? null,
     middleName: user.middleName ?? null,
     lastName: user.lastName ?? null,
     email: user.email,
     image: user.image,
     division: user.division || null,
     characterHeightCm: user.characterHeightCm ?? null,
     characterWeightKg: user.characterWeightKg ?? null,
     homeplanet: user.homeplanet ?? null,
     background: user.background ?? null,
     customAvatarDataUrl: user.customAvatarDataUrl ?? null,
     callsign: user.callsign ?? null,
     rankTitle: user.rankTitle ?? null,
     favoriteWeapon: user.favoriteWeapon ?? null,
     armor: user.armor ?? null,
     motto: user.motto ?? null,
     favoredEnemy: user.favoredEnemy ?? null,
     meritPoints: user.meritPoints ?? 0,
     twitchUrl: user.twitchUrl ?? null,
     preferredHeightUnit: user.preferredHeightUnit ?? 'cm',
     preferredWeightUnit: user.preferredWeightUnit ?? 'kg',
     discordRoles: Array.isArray(user.discordRoles) ? user.discordRoles : [],
     challengeSubmissions: user.challengeSubmissions ?? [],
     createdAt: user.createdAt,
     updatedAt: user.updatedAt,
   } as Record<string, unknown>;

   userCache.set(session.user.id, { data, expires: now + 60 * 1000 });

   return NextResponse.json(data, {
-    headers: { 'Cache-Control': 'private, max-age=60' },
+    headers: { 'Cache-Control': 'private, max-age=60', 'Vary': 'Cookie' },
   });
 }

 export async function PUT(req: Request) {
   const session = await getServerSession(getAuthOptions());
   if (!session?.user?.id) {
     return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
   }
   await dbConnect();

   const contentType = req.headers.get('content-type') || '';
   const updates: Record<string, unknown> = {};
+  const MAX_AVATAR = 2 * 1024 * 1024; // 2MB

   if (contentType.includes('multipart/form-data')) {
     const form = await req.formData();
     const fields = [
       'name',
       'firstName',
       'middleName',
       'lastName',
       'characterHeightCm',
       'characterWeightKg',
       'homeplanet',
       'background',
       'division',
       'callsign',
       'rankTitle',
       'favoriteWeapon',
       'armor',
       'motto',
       'favoredEnemy',
       'meritPoints',
       'twitchUrl',
       'preferredHeightUnit',
       'preferredWeightUnit',
     ];
@@
     const avatar = form.get('avatar');
     if (avatar && typeof avatar !== 'string') {
       const file = avatar as File;
-      if (file.size > 0) {
+      if (file.size > 0 && file.size <= MAX_AVATAR) {
         const arrayBuffer = await file.arrayBuffer();
         const base64 = Buffer.from(arrayBuffer).toString('base64');
         const dataUrl = `data:${file.type};base64,${base64}`;
         updates.customAvatarDataUrl = dataUrl;
+      } else if (file.size > MAX_AVATAR) {
+        logger.warn?.('Avatar skipped: too large');
       }
     }
@@
-    // Optional: accept discordRoles from form as JSON string
-    const rolesRaw = form.get('discordRoles');
-    if (rolesRaw && typeof rolesRaw === 'string') {
-      try {
-        const parsed = JSON.parse(rolesRaw);
-        if (Array.isArray(parsed)) updates.discordRoles = parsed
