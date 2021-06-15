import mongoose from 'mongoose';
export interface UserDocument extends Document {
  _id: string | mongoose.Types.ObjectId;
  isAdmin?: boolean;
  username?: string;
  password?: string;
  askedBy?: string;
}
