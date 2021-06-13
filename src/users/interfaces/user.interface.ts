export interface User extends Document {
  userId: string;
  isAdmin?: boolean;
  login?: string;
  password?: string;
  askedBy?: string;
}
