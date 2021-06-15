export interface User {
  _id: string;
  isAdmin?: boolean;
  username?: string;
  password?: string;
  askedBy?: string;
}
