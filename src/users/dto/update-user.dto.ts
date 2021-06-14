import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  userId: string;
  isAdmin?: boolean;
  username: string;
  password: string;
  userUsername?: string;
  userPassword?: string;
  askedBy: string;
}
