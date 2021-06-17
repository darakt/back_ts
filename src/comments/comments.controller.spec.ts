import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { getModelToken } from '@nestjs/mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { commentDocArray } from './comments.service.spec';
import { CommentMock } from './interfaces/comment.interface';
import { JwtService } from '@nestjs/jwt';
const listOfComments = [CommentMock, CommentMock];

describe('CommentsController', () => {
  let controller: CommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        AuthService,
        CommentsService,
        UsersService,
        {
          provide: JwtService,
          useValue: {
            sign: () => '',
          },
        },
        {
          provide: getModelToken('Comments'),
          useValue: {
            create: jest
              .fn()
              .mockImplementation((comment: CreateCommentDto) => {
                Promise.resolve({ ...comment });
            }),
            findAll: jest.fn().mockResolvedValue(listOfComments),
          },
        },
        {
          provide: getModelToken('User'),
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();
    controller = module.get<CommentsController>(CommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should return all the users', async () => {
    //jest.spyOn(service, 'findAll').mockResolvedValue(Promise.resolve(listOfComments));
    // not working => because types error
  });
});
