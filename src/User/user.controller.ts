/* eslint-disable prettier/prettier */
// src/user/controller/user.controller.ts

import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { ApiTags  } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailDto } from './dto/reset-email.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { CreateUserDocs,LoginUserDocs, SendEmailDocs,SendOtpDocs,VerifyOtpDocs } from '../utils/user.decorator';
import { ResetPasswordDto } from './dto/reset-password.dto';
@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('signup')
  @CreateUserDocs()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  @LoginUserDocs()
  async loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.userService.loginUser(loginUserDto);
  }


  @Put('update/:id')
  async updateUser(@Param('id') userId: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.userService.updateUser(userId, updateUserDto);

      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error.message);

      throw new Error('Failed to update user. Please try again later.');
    }
  }

  @Post('send-email')
  @SendEmailDocs()
  async sendEmail(@Body() emailDto: EmailDto) {
    try {
      
      await this.userService.sendEmail(emailDto.to, emailDto.subject, emailDto.content);
      return { message: 'Email sent successfully' };
    } catch (error) {
      
      return { message: 'Failed to send email', error: error.message };
    }
  }


  @Post('send-otp')
  @SendOtpDocs()
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    try {
    
      await this.userService.sendOtp(sendOtpDto.phoneNumber);
      return { message: 'OTP sent successfully' };
    } catch (error) {
     
      return { message: 'Failed to send OTP', error: error.message };
    }
  }
//reset password through email
@Put('reset-password/:email')
async resetPasswordwithMail(@Param('email') userEmail: string, @Body() resetPasswordDto: ResetPasswordDto) {
  try {
    const updatePassword = await this.userService.resetPasswordwithMail(userEmail, resetPasswordDto);
    return updatePassword;
  } catch (error) {
    return { message: 'Failed to reset password', error: error.message };
  }
}




  //reset password through user ID
  @Put('reset-password/:id')
  async resetPassword(@Param('id') userId: string,@Body() resetPasswordDto: ResetPasswordDto) {
    try {
    

    const updatepassword=   await this.userService.resetPassword( userId,resetPasswordDto);
      return updatepassword;
     
    } catch (error) {
        return { message: 'Failed to reset password', error: error.message };
    }
  }

@Post('verify-otp')
@VerifyOtpDocs()
async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
  try {
   
    const verificationResult = await this.userService.verifyOtp(
      verifyOtpDto.phoneNumber,
      verifyOtpDto.otp,
      verifyOtpDto.hash,

    );

    return { message: verificationResult ? 'OTP verified successfully' : 'Invalid OTP' };
  } catch (error) {
    return { message: 'Failed to verify OTP', error: error.message };
  }
}
}
