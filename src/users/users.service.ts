import { Model } from 'mongoose';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { User } from './interfaces/user.interface';
import { AuthService } from 'src/auth/auth.service';
@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async isAdmin(payload, job) {
    const updator = await this.userModel.findOne({
      userId: payload.askedBy,
    });
    if (updator && updator.isAdmin !== null && updator.isAdmin) {
      const result = await job();
      return result ? result : { msg: true };
    }
    return { msg: 'Not an admin' };
  }

  async create(createUserDto: CreateUserDto) {
    const job = async () => {
      delete createUserDto.askedBy;
      await this.userModel.create(createUserDto);
      return false;
    };
    const result = await this.isAdmin(createUserDto, job);
    if (result.msg === true) return `This action adds a new user`;
    return result;
  }

  async findAll(getUserDto: GetUserDto): Promise<User[]> {
    const job = async () => {
      return await this.userModel.find();
    };
    const result = await this.isAdmin(getUserDto, job);
    return result;
  }

  async findOneByUsername(username: string): Promise<any> {
    const people = await this.userModel.find({ username });
    return this.userModel.find({ username });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const job = async () => {
      await this.userModel.updateOne(
        { userId: updateUserDto.userId },
        { $set: updateUserDto },
      );
      return false;
    };
    const result = await this.isAdmin(updateUserDto, job);
    if (result.msg === true) return `This action update a #${id} user`;
    return result;
  }

  async remove(id: string, deleteUserDto: DeleteUserDto) {
    const job = async () => {
      await this.userModel.deleteOne({ userId: id });
      return false;
    };
    const result = await this.isAdmin(deleteUserDto, job);
    if (result.msg === true) return `This action removes a #${id} user`;
    return result;
  }
}
