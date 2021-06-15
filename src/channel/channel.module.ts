import { Module, forwardRef } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { CommentsModule } from 'src/comments/comments.module';
import { AuthModule } from 'src/auth/auth.module';
import { CommentsService } from '../comments/comments.service';
@Module({
  imports: [CommentsModule, AuthModule],
  controllers: [ChannelController],
  providers: [ChannelService, CommentsService],
})
export class ChannelModule {}
