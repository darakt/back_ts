import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CommentDocument } from '../comments/interfaces/comment-document.interface';
import { ObjectId } from 'mongodb';
@Injectable()
export class ChannelService {
  constructor(
    @InjectModel('Comments') private commentsModel: Model<CommentDocument>,
  ) {}

  async findAll(channel: string) {
    return await this.commentsModel.find({ channelId: channel }).exec();
  }

  async findAllForAUser(id: string) {
    return await this.commentsModel.find({ userId: new ObjectId(id) }).exec();
  }

  async removeAWholeChannel(channel: string) {
    return await this.commentsModel.deleteMany({ channelId: channel }).exec();
  }
}
