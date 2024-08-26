/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailDto } from './dto/reset-email.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import {
  CreateUserDocs,
  LoginUserDocs,
  SendEmailDocs,
  SendOtpDocs,
  VerifyOtpDocs,
} from '../utils/decorator/user.decorator';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailLinkDto } from './dto/verify-email-link.dto';
import { LinkEmailDto } from './dto/reset-link.dto';
import { ResetPasswordwithMailDto } from './dto/reset-pw-with-mail.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { Injectable } from '@nestjs/common';
import { imageFileInterceptor } from 'src/utils/interceptor/userfile.interceptor';
import { UserId } from 'src/utils/decorator/userId.decorator';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/utils/guard';
import { swaggerDocs } from 'src/utils/decorator/swagger.decorator';
import { UpsertPreferencesDto } from './dto/upsert-prefrences.dto';

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

  @Get('userProfile')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  async getUserProfile(@UserId() userId: string) {
    return this.userService.getUserProfile(userId);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post('update')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(imageFileInterceptor)
  async updateUser(
    @UserId() userId: string,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
    },

    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.userService.updateUser(
      userId,
      files,
      updateUserDto,
    );
    return updatedUser;
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @Post('reset-password')
  async resetPassword(
    @UserId() userId: string,
    @Body() resetPassword: ResetPasswordDto,
  ) {
    const updatedUser = await this.userService.resetPassword(
      userId,
      resetPassword,
    );
    return updatedUser;
  }

  @Put('password/:token')
  async resetPasswordwithMail(
    @Param('token') token: string,
    @Body() resetPasswordwithMailDto: ResetPasswordwithMailDto,
  ) {
    const updatePassword = await this.userService.resetPasswordwithMail(
      token,
      resetPasswordwithMailDto,
    );
    return updatePassword;
  }

  @Post('send-otp')
  @SendOtpDocs()
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    const OTP = await this.userService.sendOtp(sendOtpDto.phoneNumber);
    return OTP;
  }

  @Post('password-reset-email-link')
  async resetPasswordEmail(@Body() LinkEmailDto: LinkEmailDto) {
    const sendPwEmail = await this.userService.sendpasswordResetEmail(
      LinkEmailDto.to,
    );
    return sendPwEmail;
  }

  @Post('verify-otp')
  @VerifyOtpDocs()
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const verificationResult = await this.userService.verifyOtp(
      verifyOtpDto.phoneNumber,
      verifyOtpDto.otp,
      verifyOtpDto.hash,
    );
    return verificationResult;
  }

  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @swaggerDocs({
    summary: 'Upsert preferences of User',
    type: null,
    goodResponse: {
      status: 201,
      description: 'Upsert the User preferences',
    },
    badresponse: { status: 400, description: 'User not found' },
  })
  @Post('preferences')
  async upsertPreferences(
    @Body() upsertPreferences: UpsertPreferencesDto,
    @UserId() userId: string,
  ) {
    const result = await this.userService.upsertPreferences(
      upsertPreferences,
      userId,
    );
    return result;
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
  // @Post('google-login')
  // @ApiBody({ required: true, schema: { example: { access_token: 'string' } } })
  // async googleLogin(@Body('access_token') accessToken: string): Promise<{ token: string }> {
  //   return this.userService.googleLogin(accessToken);
  // }
}
