import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const [user] = await this.usersService.findOneByUsername(username);
    console.log('validate');
    console.log(user.password);
    console.log(pass);
    if (user && user.password === pass) {
      // should use hash
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
