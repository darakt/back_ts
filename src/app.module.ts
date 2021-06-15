import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { ChannelModule } from './channel/channel.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    MongooseModule.forRoot('mongodb://user:user@database:27017/aDatabase'),
    forwardRef(() => AuthModule),
    CommentsModule,
    ChannelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
