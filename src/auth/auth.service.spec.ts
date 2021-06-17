import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService, UsersService } from '../users/users.service';

describe.only('AuthService', () => {
  let service: AuthService;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    user =module.
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
