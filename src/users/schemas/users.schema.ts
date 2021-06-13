import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  userId: String,
  isAdmin: Boolean,
  login: String,
  password: String,
});
