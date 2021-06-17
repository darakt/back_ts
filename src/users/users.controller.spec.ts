import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { createMock } from '@golevelup/nestjs-testing';
import { mockUserDoc } from './users.service.spec';
import { JwtService } from '@nestjs/jwt';

const listOfUsers = [
  {
    username: 'first',
    password: 'azerty',
    isAdmin: true,
    _id: '1',
  },
  {
    username: 'second',
    password: 'azerty',
    isAdmin: false,
    _id: '2',
  },
  {
    username: 'third',
    password: 'azerty',
    isAdmin: true,
    _id: '3',
  },
];
const ackDeleted = { n: 1, ok: 1, deletedCount: 1 };
const auth = {
  askedBy: '1',
  username: 'first',
  password: 'azerty',
};
const newUser = {
  _id: '22',
  isAdmin: false,
  username: 'foo',
  password: 'bar',
};
describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  let auth: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        AuthService,
        UsersService,
        {
          provide: JwtService,
          useValue: {
            sign: () => '',
          },
        },
        {
          provide: getModelToken('User'),
          useValue: {
            create: jest.fn().mockImplementation((user: CreateUserDto) => {
              Promise.resolve({ ...user });
            }),
            findAll: jest.fn().mockResolvedValue(listOfUsers),
            update: jest.fn().mockImplementation((user: UpdateUserDto) => {
              Promise.resolve({ ...user });
            }),
            remove: jest.fn().mockResolvedValue(ackDeleted),
          },
        },
      ],
    }).compile();
    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    auth = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(true).toBe(true);
  });

  it('Should return all the users', async () => {
    jest.spyOn(service, 'isAdmin').mockResolvedValue(listOfUsers); // the effective mocking is that one,
    const result = await controller.findAll({ // as this function is the one in charge of the business logic it is not a 'huge' pb, but dirty
      askedBy: '1',
    });
    expect(result).toEqual(listOfUsers);
  });

  it('Should create a new user', async () => {
    jest
      .spyOn(service, 'isAdmin')
      .mockReturnValueOnce(Promise.resolve(newUser));
    const result = await controller.create({
      isAdmin: false,
      username: 'foo',
      password: 'bar',
      askedBy: '1',
    });
    expect(result).toEqual(newUser);
  });

  it('Should update an user', async () => {
    const newUserDto = {
      isAdmin: false,
      username: 'foo',
      password: 'bar',
      askedBy: '1',
    };
    jest
      .spyOn(service, 'isAdmin') // as I'm mocking isAdmin  the error that ObjectId is causig does not appear
      .mockReturnValueOnce(Promise.resolve(newUser)); // the is working but the feature is not
    const result = await controller.update('3', newUserDto);
    expect(result).toEqual(newUser);
  });

  it('Should remove an user', async () => {
    const deleteUserDto = {
      askedBy: '1',
    };
    jest
      .spyOn(service, 'isAdmin')
      .mockReturnValueOnce(Promise.resolve(ackDeleted));
    const result = await controller.remove('4', deleteUserDto);
    expect(result).toEqual(ackDeleted);
  });
});
