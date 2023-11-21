/* eslint-disable prettier/prettier */
// src/user/controller/user.controller.ts

import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('login') // New login endpoint
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.userService.loginUser(loginUserDto);
  }

  @Put('update/:id') // New update endpoint
  async updateUser(@Param('id') userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(userId, updateUserDto);
  }


}
