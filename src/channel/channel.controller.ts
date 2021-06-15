import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { CommentsService } from 'src/comments/comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('channel')
export class ChannelController {
  constructor(
    private readonly authService: AuthService,
    private readonly commentsService: CommentsService,
    private readonly channelService: ChannelService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findAll(@Param('id') id: string) {
    return this.channelService.findAll(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:id')
  findAllOfAUser(@Param('id') id: string) {
    return this.channelService.findAllForAUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.channelService.removeAWholeChannel(id);
  }
}
