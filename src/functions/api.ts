import * as functions from 'firebase-functions';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';

const uri = functions.config().mongodb.uri;

const app = express();

if (mongoose.connection.readyState === 0) {
  mongoose.connect(uri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
}

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
});
const User = mongoose.models.User || mongoose.model('User', UserSchema);

app.get('/user/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export const api = functions.https.onRequest(app);
