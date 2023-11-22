/* eslint-disable prettier/prettier */
// src/user/controller/user.controller.ts

import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailDto } from './dto/reset-email.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  @ApiTags('Authentication')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.userService.loginUser(loginUserDto);
  }

  @Put('update/:id')
  @ApiTags('User Operations')
  async updateUser(@Param('id') userId: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(userId, updateUserDto);
  }

  @Post('send-email')
  @ApiOperation({ summary: 'Send email' })
  @ApiBody({ type: EmailDto }) // Define EmailDto with necessary fields (e.g., to, subject, content)
  @ApiResponse({ status: 200, description: 'Email sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async sendEmail(@Body() emailDto: EmailDto) {
    try {
      // Assuming you have an EmailService with a sendEmail method
      await this.userService.sendEmail(emailDto.to, emailDto.subject, emailDto.content);
      return { message: 'Email sent successfully' };
    } catch (error) {
      // Handle errors appropriately
      return { message: 'Failed to send email', error: error.message };
    }
  }
}
