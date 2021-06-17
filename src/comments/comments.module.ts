import { Module, forwardRef } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema } from './schemas/comments.schema';
import { AuthService } from 'src/auth/auth.service';
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
