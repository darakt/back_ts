export interface UserDocument extends Document {
  userId: string;
  isAdmin?: boolean;
  username?: string;
  password?: string;
  askedBy?: string;
}
