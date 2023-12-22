/* eslint-disable prettier/prettier */
// src/user/controller/user.controller.ts

import { Body, Controller, HttpException, HttpStatus, Param, Post, Put, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiConsumes, ApiTags  } from '@nestjs/swagger';
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
  async googleLogin(@Body('access_token') accessToken: string): Promise<{ token: string }> {
    return this.userService.googleLogin(accessToken);
  }

  @Put('update/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 5 },
    ],
      {
        fileFilter: (req, file, cb) => {
          const allowedImageTypes = ['.png', '.jpeg', '.jpg'];

          const ext = extname(file.originalname);

          if (file.fieldname === 'image' && allowedImageTypes.includes(ext)) {
            cb(null, true);
          } 
          else {
            cb(
              new HttpException('Invalid file type.', HttpStatus.BAD_REQUEST),
              false,
            );
          }
        },
        limits: {
          fileSize: 4 * 1024 * 1024,
        },
      },
    ),

  )
  async updateUser(@Param('id') userId: string,
  @UploadedFiles()
  files: {
    image?: Express.Multer.File[];
  },
  
  
  @Body() updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.userService.updateUser(userId,files, updateUserDto);

      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error.message);

      throw new Error('Failed to update user. Please try again later.');
    }
  }
  @Put('reset-password/:id')
  async resetPassword(@Param('id') userId: string, @Body() resetPassword: ResetPasswordDto) {
    try {
      const updatedUser = await this.userService.resetPassword(userId, resetPassword);

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


@Put('reset-password/:email')
async resetPasswordwithMail(@Param('email') userEmail: string, @Body() resetPasswordwithMailDto: ResetPasswordwithMailDto) {
  try {
    const updatePassword = await this.userService.resetPasswordwithMail(userEmail, resetPasswordwithMailDto);
    return updatePassword;
  } catch (error) {
    return { message: 'Failed to reset password', error: error.message };
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

@Post ('verify-password-reset-link')
async verifyPasswordResetLink(@Body() verifyEmailDto: VerifyEmailLinkDto) {
  try {
    const verificationResult = await this.userService.verifyToken(
      
      verifyEmailDto.token,
    );

    return { message: verificationResult ? verificationResult : 'Link Expired' };
  } catch (error) {
    return { message: 'Failed to verify Link', error: error.message };
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
