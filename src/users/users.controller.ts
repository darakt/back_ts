import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
@Controller('users')
export class UsersController {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard('local'))
  @Get()
  async findAll(@Body() getUserDto: GetUserDto) {
    return this.usersService.findAll(getUserDto);
  }

  @UseGuards(AuthGuard('local'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneByUsername(id);
  }

  @UseGuards(AuthGuard('local'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(AuthGuard('local'))
  @Delete(':id')
  remove(@Param('id') id: string, @Body() deleteUserDto: DeleteUserDto) {
    return this.usersService.remove(id, deleteUserDto);
  }
}
