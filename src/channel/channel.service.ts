import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommentDocument } from '../comments/interfaces/comment-document.interface';
@Injectable()
export class ChannelService {
  constructor(
    @InjectModel('Comments') private commentsModel: Model<CommentDocument>,
  ) {}

  async findAll(channel: string) {
    return await this.commentsModel.find({ channelId: channel }).exec();
  }

  async findAllForAUser(id: string) {
    const res = await this.commentsModel
      .find({ userId: new Types.ObjectId(id) })
      .exec();
    return res;
  }

  async removeAWholeChannel(channel: string) {
    return await this.commentsModel.deleteMany({ channelId: channel }).exec();
  }
}
