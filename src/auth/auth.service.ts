import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const [user] = await this.usersService.findOneByUsername(username);
    if (user && user.password === pass) {
      // should use hash
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
