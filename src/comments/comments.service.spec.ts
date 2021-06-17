import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { CommentDocument } from './interfaces/comment-document.interface';
import { Comment } from './interfaces/comment.interface';
import { mockUser } from '../users/users.service.spec';
import { JwtService } from '@nestjs/jwt';

const getRandomInt = (max) => {
  return '' + Math.floor(Math.random() * max);
};

const mockComment = (
  userId = '3',
  orderId = '3',
  georeferenceId = '9',
  text = 'this a comment',
): Comment => ({
  userId,
  orderId,
  georeferenceId,
  text,
});

export const mockCommentDoc = (
  mock?: Partial<Comment>,
): Partial<CommentDocument> => ({
  _id: getRandomInt(10),
  userId: mock?.userId || '2',
  orderId: mock?.orderId || '3',
  georeferenceId: mock?.georeferenceId || '2',
  timeStamp: new Date(),
  channelId: '2o3g2',
  text: mock?.text || 'a comment',
});

export const commentDocArray = [
  mockCommentDoc(),
  mockCommentDoc({ userId: '5' }),
  mockCommentDoc({ userId: '1' }),
];

describe('CommentsService', () => {
  let model: Model<CommentDocument>;
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        UsersService,
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: () => '',
          },
        },
        {
          provide: getModelToken('Comments'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockComment()),
            constructor: jest.fn().mockResolvedValue(mockComment()),
            find: jest.fn(),
            findOne: jest.fn(),
            updateOne: jest.fn(),
            create: jest.fn(),
            deleteOne: jest.fn(),
            exec: jest.fn(),
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

    model = module.get<Model<CommentDocument>>(getModelToken('Comments'));
    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should create a new user', async () => {
    jest
      .spyOn(model, 'create')
      .mockImplementationOnce(() => Promise.resolve(mockComment()));
    const newUser = await service.create({
      userId: '60c8989238d29f10f1cb8834',
      orderId: '5',
      georeferenceId: '9',
      text: 'this is a comment',
    });
    expect(newUser).toEqual(mockComment());
  });

  it('should get all the comments', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(commentDocArray),
    } as any);
    const users = await service.findAll();
    expect(users).toEqual(commentDocArray);
  });

  it('Should generate a channelId from userId, orderId and georeferenceId', () => {
    expect(
      service.generateChannelId({
        userId: '2',
        orderId: '4',
        georeferenceId: '5',
      }),
    ).toEqual('2o4g5');
  });

  it('Should generate a channelId from userId and georeferenceId', () => {
    expect(
      service.generateChannelId({
        userId: '2',
        georeferenceId: '5',
      }),
    ).toEqual('2g5');
  });

  it('Should generate a channelId from userId, orderId and georeferenceId', () => {
    expect(
      service.generateChannelId({
        userId: '2',
        orderId: '4',
      }),
    ).toEqual('2o4');
  });

  it('Should generate a channelId from an userId', () => {
    expect(
      service.generateChannelId({
        userId: '2',
      }),
    ).toEqual('2');
  });
});
