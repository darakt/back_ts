import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  userId: string;
  isAdmin?: boolean;
  login?: string;
  password?: string;
  askedBy: string;
}