import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
@Module({
  imports: [PassportModule, forwardRef(() => UsersModule)],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
