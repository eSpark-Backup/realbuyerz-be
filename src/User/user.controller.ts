/* eslint-disable prettier/prettier */
// src/user/controller/user.controller.ts

import { Body, Controller,  Param, Post, Put, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags  } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailDto } from './dto/reset-email.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { CreateUserDocs,LoginUserDocs, SendEmailDocs,SendOtpDocs,VerifyOtpDocs } from '../utils/user.decorator';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailLinkDto } from './dto/verify-email-link.dto';
import { LinkEmailDto } from './dto/reset-link.dto';
import { ResetPasswordwithMailDto } from './dto/reset-pw-with-mail.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { Injectable } from '@nestjs/common';
import { imageFileInterceptor } from 'src/utils/userfile.interceptor';


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
  @Post('google-login')
  @ApiBody({ required: true, schema: { example: { access_token: 'string' } } })
  async googleLogin(@Body('access_token') accessToken: string): Promise<{ token: string }> {
    return this.userService.googleLogin(accessToken);
  }

  @Put('update/:token')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(imageFileInterceptor)
  async updateUser(@Param('token') token: string,
  @UploadedFiles()
  files: {
    image?: Express.Multer.File[];
  },
  
  
  @Body() updateUserDto: UpdateUserDto) {
    try {

      const updatedUser = await this.userService.updateUser(token,files, updateUserDto);

      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error.message);

      throw new Error('Failed to update user. Please try again later.');
    }
  }
  @Put('reset-password/:token')
  async resetPassword(@Param('token') token: string, @Body() resetPassword: ResetPasswordDto) {
    try {
      const updatedUser = await this.userService.resetPassword(token, resetPassword);

      return updatedUser;
    } catch (error) {
      console.error('Error updating Password:', error.message);

      throw new Error('Failed to update Password. Please try again later.');
    }
  }


  // @Post('send-email')
  // @SendEmailDocs()
  // async sendEmail(@Body() emailDto: EmailDto) {
  //   try {
      
  //     await this.userService.sendEmail(emailDto.to, emailDto.subject, emailDto.content);
  //     return { message: 'Email sent successfully' };
  //   } catch (error) {
      
  //     return { message: 'Failed to send email', error: error.message };
  //   }
  // }

  @Put('password/:token')
  async resetPasswordwithMail(@Param('token') token: string, @Body() resetPasswordwithMailDto: ResetPasswordwithMailDto) {
    try {
      const updatePassword = await this.userService.resetPasswordwithMail(token, resetPasswordwithMailDto);
      return updatePassword;
    } catch (error) {
      return { message: 'Failed to reset password', error: error.message };
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





@Post ('password-reset-email-link')
async resetPasswordEmail(@Body() LinkEmailDto: LinkEmailDto) {
try{
   await this.userService.sendpasswordResetEmail(LinkEmailDto.to);

  return { message: 'Email sent successfully' };
}
  catch (error) {
    return { message: 'Failed to send password reset email', error: error.message };
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
