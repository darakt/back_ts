import { Module, forwardRef } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema } from './schemas/comments.schema';
import { UserSchema } from 'src/users/schemas/users.schema';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { PassportModule } from '@nestjs/passport';
import { UsersController } from 'src/users/users.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Comments', schema: CommentSchema }]),
    forwardRef(() => UsersModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [CommentsController],
  providers: [AuthService, CommentsService],
  exports: [
    CommentsService,
    MongooseModule.forFeature([{ name: 'Comments', schema: CommentSchema }]),
  ],
})
export class CommentsModule {}
