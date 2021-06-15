import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

export const CommentSchema = new mongoose.Schema({
  userId: String,
  orderId: String,
  georeferenceId: String,
  channelId: String,
  text: String,
  timeStamp: Date,
});
