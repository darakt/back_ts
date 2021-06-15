import mongoose from 'mongoose';

export interface CommentDocument extends Document {
  _id: string | mongoose.Types.ObjectId;
  userId: string | mongoose.Types.ObjectId;
  orderId: string | mongoose.Types.ObjectId;
  georeferenceId: string | mongoose.Types.ObjectId;
  channelId: string;
  text: string;
  timeStamp: Date;
}
