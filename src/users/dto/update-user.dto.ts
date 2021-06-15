import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  isAdmin?: boolean;
  username?: string;
  password?: string;
  askedBy: string;
}
