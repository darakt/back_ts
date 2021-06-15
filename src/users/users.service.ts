import { Model } from 'mongoose';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UserDocument as User } from './interfaces/user-document.interface';
import { AuthService } from 'src/auth/auth.service';
@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async isAdmin(payload, job) {
    const updator = await this.userModel
      .findOne({
        userId: payload.askedBy,
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
      delete createUserDto.askedBy;
      return await this.userModel.create({
        userId: createUserDto.userId,
        isAdmin: createUserDto.isAdmin,
        username: createUserDto.userUsername,
        password: createUserDto.userPassword,
      });
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
    return await this.userModel.find({ login: username }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const job = async () => {
      const updated = { ...updateUserDto };
      delete updated.username;
      delete updated.password;
      delete updated.askedBy;
      if (updated.userUsername) { // add test for those cases => same test as update but with different inputs
        updated.username = updated.userUsername;
        delete updated.userUsername;
      }
      if (updated.userPassword) {
        updated.password = updateUserDto.userPassword;
        delete updated.userPassword;
      }
      const foo = await this.userModel
        .updateOne({ userId: id }, { $set: updated })
        .exec();
      return foo;
    };
    return await this.isAdmin(updateUserDto, job);
  }

  async remove(id: string, deleteUserDto: DeleteUserDto) {
    const job = async () => {
      return await this.userModel.deleteOne({ userId: id });
    };
    return await this.isAdmin(deleteUserDto, job);
  }
}
