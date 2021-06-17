import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { User } from './interfaces/user.interface';
import { UserDocument } from './interfaces/user-document.interface';
import { Model, mongo, Query } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { createMock } from '@golevelup/nestjs-testing';
import { JwtService } from '@nestjs/jwt';

export const mockUser = (
  username = 'second',
  password = 'azerty',
  isAdmin = false,
  _id = '2',
): User => ({
  username,
  password,
  isAdmin,
  _id,
});

export const mockUserDoc = (mock?: Partial<User>): Partial<UserDocument> => ({
  username: mock?.username || 'second',
  password: mock?.password || 'azerty',
  isAdmin: mock?.isAdmin || false,
  _id: mock?._id || '2',
});

const usersArray = [
  mockUser('first', 'azerty', true, '1'),
  mockUser(),
  mockUser('third', 'azerty', false, '3'),
];

const usersDocArray = [
  mockUserDoc({
    username: 'first',
    password: 'azerty',
    isAdmin: true,
    _id: '1',
  }),
  mockUserDoc(),
  mockUserDoc({
    username: 'third',
    password: 'azerty',
    isAdmin: false,
    _id: '3',
  }),
];

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: () => '',
          },
        },
        {
          provide: getModelToken('User'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser()),
            constructor: jest.fn().mockResolvedValue(mockUser()),
            find: jest.fn(),
            findOne: jest.fn(),
            updateOne: jest.fn(),
            create: jest.fn(),
            deleteOne: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<UserDocument>>(getModelToken('User'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should return all users', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(usersDocArray),
    } as any);

    jest.spyOn(model, 'findOne').mockReturnValueOnce(
      createMock<any>({ // did not want <Query<UserDocument, UserDocument>>, after 2H I went forward
        exec: jest.fn().mockResolvedValueOnce(
          mockUserDoc({
            username: 'first',
            password: 'azerty',
            isAdmin: true,
            _id: '1',
          }),
        ),
      }),
    );
    const payload = {
      askedBy: '1',
    };
    const users = await service.findAll(payload);
    expect(users).toEqual(usersArray);
  });

  it('Should return a user by username', async () => {
    jest.spyOn(model, 'find').mockReturnValueOnce(
      createMock<any>({ // did not want <Query<UserDocument, UserDocument>>, after 2H I went forward
        exec: jest.fn().mockResolvedValueOnce([mockUserDoc()]),
      }),
    );
    const user = await service.findOneByUsername('second');
    await expect(user).toEqual([mockUser()]);
  });

  it('should insert a new user', async () => {
    jest.spyOn(model, 'create').mockImplementationOnce(() =>
      Promise.resolve({
        username: 'fourth',
        password: 'azerty',
        isAdmin: false,
        _id: '4',
      }),
    );
    jest.spyOn(model, 'findOne').mockReturnValueOnce(
      createMock<any>({ // did not want <Query<UserDocument, UserDocument>>, after 2H I went forward
        exec: jest.fn().mockResolvedValueOnce(
          mockUserDoc({
            username: 'first',
            password: 'azerty',
            isAdmin: true,
            _id: '1',
          }),
        ),
      }),
    );
    const newUser = await service.create({
      username: 'fourth',
      password: 'azerty',
      isAdmin: false,
      askedBy: '1',
    });
    expect(newUser).toEqual(mockUser('fourth', 'azerty', false, '4'));
  });

  it('should update a user successfully', async () => {
    const mongoAnswer = { n: 1, nModified: 1, ok: 1 };
    jest.spyOn(model, 'updateOne').mockReturnValueOnce(
      createMock<any>({
        exec: jest.fn().mockResolvedValueOnce(mongoAnswer), // no exec on findOneAndUpdate???
      }),
    );
    jest.spyOn(model, 'findOne').mockReturnValueOnce(
      createMock<any>({ // did not want <Query<UserDocument, UserDocument>>, after 2H I went forward
        exec: jest.fn().mockResolvedValueOnce(
          mockUserDoc({
            username: 'first',
            password: 'azerty',
            isAdmin: true,
            _id: '1',
          }),
        ),
      }),
    );
    const result = await service.update('3', {
      username: 'third',
      password: 'azerty',
      isAdmin: false,
      askedBy: '1',
    });
    expect(result).toEqual(mongoAnswer);
  });

  it('should delete a user successfully', async () => {
    const mongoAnswer = { acknowledged: true, deletedCount: 1 };
    jest.spyOn(model, 'deleteOne').mockResolvedValueOnce(mongoAnswer as any);
    jest.spyOn(model, 'findOne').mockReturnValueOnce(
      createMock<any>({ // did not want <Query<UserDocument, UserDocument>>, after 2H I went forward
        exec: jest.fn().mockResolvedValueOnce(
          mockUserDoc({
            username: 'first',
            password: 'azerty',
            isAdmin: true,
            _id: '1',
          }),
        ),
      }),
    );
    expect(
      await service.remove('an id', {
        askedBy: '1',
      }),
    ).toEqual(mongoAnswer);
  });

  it('should not delete a user if id incorrect', async () => {
    const mongoAnswer = { acknowledged: true, deletedCount: 0 };
    jest.spyOn(model, 'deleteOne').mockResolvedValueOnce(mongoAnswer as any);
    jest.spyOn(model, 'findOne').mockReturnValueOnce(
      createMock<any>({ // did not want <Query<UserDocument, UserDocument>>, after 2H I went forward
        exec: jest.fn().mockResolvedValueOnce(
          mockUserDoc({
            username: 'first',
            password: 'azerty',
            isAdmin: true,
            _id: '1',
          }),
        ),
      }),
    );
    expect(
      await service.remove('an id', {
        askedBy: '1',
      }),
    ).toEqual(mongoAnswer);
  });

  it('Should confirm that a user is an admin', async () => {
    jest.spyOn(model, 'findOne').mockReturnValueOnce(
      createMock<any>({ // did not want <Query<UserDocument, UserDocument>>, after 2H I went forward
        exec: jest.fn().mockResolvedValueOnce(
          mockUserDoc({
            username: 'first',
            password: 'azerty',
            isAdmin: true,
            _id: '1',
          }),
        ),
      }),
    );
    const payload = {
      askedBy: '1',
    }
    const job = () => ({
      msg: "isAdmin's value is true",
    });
    const user = await service.isAdmin(payload, job);
    await expect(user).toEqual({
      msg: "isAdmin's value is true",
    });
  });

  it('Should confirm that a user is not an admin', async () => {
    jest.spyOn(model, 'findOne').mockReturnValueOnce(
      createMock<any>({ // did not want <Query<UserDocument, UserDocument>>, after 2H I went forward
        exec: jest.fn().mockResolvedValueOnce(
          mockUserDoc({
            username: 'second',
            password: 'azerty',
            isAdmin: false,
            _id: '2',
          }),
        ),
      }),
    );
    const payload = {
      askedBy: '1',
    }
    const job = () => ({
      msg: "isAdmin's value is true",
    });
    const user = await service.isAdmin(payload, job);
    await expect(user).toEqual({ msg: 'Not an admin' });
  });
});
