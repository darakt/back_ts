import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UserDocument as User } from './interfaces/user-document.interface';
import { ObjectId } from 'mongodb';
import { Types } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async isAdmin(payload, job) {
    const updator = await this.userModel
      .findOne({
        _id: new Types.ObjectId(payload.askedBy), // half of the tests are now broken because of the Types.ObjectId
      })
      .exec();
    if (updator && updator.isAdmin !== null && updator.isAdmin) {
      const result = await job();
      return result;
    }
    return { msg: 'Not an admin' };
  }

  async create(createUserDto: CreateUserDto) {
    const job = async () => {
      const newUser = { ...createUserDto };
      return await this.userModel.create(newUser);
    };
    return await this.isAdmin(createUserDto, job);
  }

  async findAll(getUserDto: GetUserDto): Promise<User[]> {
    const job = async () => {
      return await this.userModel.find().exec();
    };
    return await this.isAdmin(getUserDto, job);
  }

  async findOneByUsername(username: string): Promise<any> {
    return await this.userModel.find({ username }).exec(); // username needs to be unique
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const job = async () => {
      const updated = { ...updateUserDto };
      const foo = await this.userModel
        .updateOne({ _id: new Types.ObjectId(id) }, { $set: updated }) // not working since I've started using ObjectID 
        .exec(); //before I was using a userId: string, a fin() is working
      return foo;
    };
    return await this.isAdmin(updateUserDto, job);
  }

  async remove(id: string, deleteUserDto: DeleteUserDto) {
    const job = async () => {
      return await this.userModel.deleteOne({ _id: new ObjectId(id) });
    };
    return await this.isAdmin(deleteUserDto, job);
  }
}
