import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/remove-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { CommentDocument } from './interfaces/comment-document.interface';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel('Comments') private commentsModel: Model<CommentDocument>,
  ) {}

  generateChannelId = (ids) => {
    let channelId = '';
    if (ids.hasOwnProperty('userId')) channelId = ids.userId; // should not happen beacause of typescript
    if (ids.hasOwnProperty('orderId')) channelId += 'o' + ids.orderId;
    if (ids.hasOwnProperty('georeferenceId'))
      channelId += 'g' + ids.georeferenceId;
    return channelId;
  };

  async create(createCommentDto: CreateCommentDto) {
    return await this.commentsModel.create({
      ...createCommentDto,
      timeStamp: new Date(), // just to be sure that the timestamp is created in the back
      channelId: this.generateChannelId(createCommentDto),
    });
  }

  async findAll() {
    return await this.commentsModel.find().exec();
  }

  // async remove(id: string) {
  //   return await this.commentsModel.deleteOne({ _id: id });
  // }
  // findOne(id: number) {
  //   return `This action returns a #${id} comment`;
  // }
  // TODO: if some time is left
  // update(id: number, updateCommentDto: UpdateCommentDto) {
  //   return `This action updates a #${id} comment`;
  // }
}
