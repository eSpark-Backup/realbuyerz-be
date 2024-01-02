/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as jwt from 'jsonwebtoken';
import { UpdateUserDto } from './dto/update-user.dto';
import sgMail = require('@sendgrid/mail');
import * as CryptoJS from 'crypto-js';
import { SHA256 } from 'crypto-js';
import * as uuid from 'uuid';
import * as path from 'path';
import { promises as fsPromises } from 'fs';
import axios from 'axios';
import * as  Sharp from 'sharp';
import * as otpGenerator from 'otp-generator';
import * as crypto from 'crypto';
import * as Twilio from 'twilio';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordwithMailDto } from './dto/reset-pw-with-mail.dto';
import { extname } from 'path';
import { OAuth2Client } from 'google-auth-library';
import { saveImageToDisk } from '../utils/saveImage';

const TOKEN_KEY = process.env.TOKEN_KEY;
const key = process.env.OTP_KEY;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const token_expiry = process.env.TOKEN_EXPIRY;

@Injectable()
export class UserService {
  private readonly client: OAuth2Client;

  private twilioClient: Twilio.Twilio;

  constructor(private readonly prismaService: PrismaService) {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    this.twilioClient = Twilio(twilioAccountSid, twilioAuthToken);

  }
  async hashPassword(password: string): Promise<string> {
    const hashedPassword = SHA256(password).toString(CryptoJS.enc.Hex);
    return hashedPassword;
  }

  async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
    const enteredPasswordHash = SHA256(plainPassword).toString(CryptoJS.enc.Hex);
    return enteredPasswordHash === hashedPassword;
  }
  async resetPasswordwithMail(token: string, resetPasswordwithMailDto: ResetPasswordwithMailDto) {
    try {
      const { email, exp } = jwt.verify(token, TOKEN_KEY) as { email: string, exp?: number };

      if (!exp) {
        return { error: 'Invalid access token' };
      }

      const expirationTime = new Date(exp * 1000);
      const currentTime = new Date();

      if (currentTime >= expirationTime) {
        return { error: 'Token has Expired' };
      }



      const { password } = resetPasswordwithMailDto;

      const user = await this.prismaService.user.findUnique({
        where: { email: email },
      });

      if (!user) {
        return { success: false, message: 'User not found' };
      }
      if (!user.password_reset_token || user.password_reset_token !== token) {
        return { success: false, message: 'Password reset link is expired or invalid' };
      }


      const hashedPassword = await this.hashPassword(password);

      await this.prismaService.user.update({
        where: { email: email },
        data: {
          password: hashedPassword,
          password_reset_token: null,
        },
      });
      const response = {
        timestamp_ms: Date.now(),
        action: 'Password Reset',

      };


      return { success: true, message: 'Password reset successfully', response };

    } catch (error) {


      return { success: false, message: 'Failed to reset password. Please try again later.', error };
    }
  }

  async sendpasswordResetEmail(to: string): Promise<void> {
    const token = jwt.sign({ email: to }, TOKEN_KEY, { expiresIn: token_expiry });
    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;


    try {
      await this.prismaService.user.update({
        where: { email: to },
        data: { password_reset_token: token },
      });

      await this.sendEmail(to, 'Password Reset Link', link);

    } catch (error) {
      throw new Error('Failed to send password reset email');
    }
  }

  async googleLogin(accessToken: string): Promise<{ token: string }> {
    const userInfo = await this.verifyGoogleAccessToken(accessToken);

    if (!userInfo || userInfo.success === false) {
      throw new HttpException('Failed to Verify Google Access Token', HttpStatus.UNAUTHORIZED);

    }

    const user = await this.prismaService.user.findUnique({ where: { email: userInfo.email } });

    if (user) {
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        TOKEN_KEY,
        { expiresIn: token_expiry }
      );
      return { token };
    } else {
      throw new Error('User not found');
    }
  }

  async verifyGoogleAccessToken(accessToken: string): Promise<any> {
    try {
      const response = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`);
      const tokenInfo = response.data;



      return tokenInfo;
    } catch (error) {
      return false;

    }
  }





  async verifyToken(token: string): Promise<string> {
    try {
      const { email, exp } = jwt.verify(token, TOKEN_KEY) as { email: string, exp?: number };

      if (!exp) {
        throw new Error('Token does not contain expiration information');
      }

      const expirationTime = new Date(exp * 1000);
      const currentTime = new Date();

      if (currentTime >= expirationTime) {
        throw new Error('Token has expired');
      }

      const user = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error('User not found with that Email');
      }

      return user.email;
    } catch (error) {
      throw new Error(error.message);
    }
  }








  async verifyOtp(phone: string, otp: string, hash: string): Promise<string> {
    try {
      const [hashValue, expires] = hash.split('.');
      const now = Date.now();

      if (now > parseInt(expires)) {
        throw new Error('OTP Expired');
      }

      const data = `${phone}.${otp}.${expires}`;
      const newCalculateHash = crypto.createHmac('sha256', key).update(data).digest('hex');

      if (newCalculateHash === hashValue) {
        return 'Success';
      }

      throw new Error('Invalid OTP');
    } catch (error) {
      throw new Error(error.message);
    }
  }



  async sendOtp(phone: string): Promise<string> {
    const otp = otpGenerator.generate(4, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const ttl = 5 * 60 * 1000;
    const expires = Date.now() + ttl;
    const data = `${phone}.${otp}.${expires}`;
    const hash = crypto.createHmac('sha256', key).update(data).digest('hex');
    const fullHash = `${hash}.${expires}`;
    const otpp = `${otp}`;

    console.log(`Your OTP is ${otp}`);
    console.log(`Hash value is ${fullHash}`);
    await this.twilioClient.messages.create({
      body: otpp + ' is your RealBuyerz. Do not share it with anyone.',
      to: '+92' + phone,
      from: twilioPhoneNumber,
    });

    return fullHash;
  }

  async sendEmail(to: string, subject: string, content: string): Promise<void> {
    try {
      const msg = {
        to,
        from: 'Real Buyerz <ahsansaleem@esparkconsultants.com>',
        subject,
        text: content,
        html: `<p>${content}</p>`,
      };

      await sgMail.send(msg);
    } catch (error) {
      throw new Error('Failed to send emaiil');
    }
  }
  async createUser(createUserDto: CreateUserDto) {
    try {
      const emailSubject = 'Welcome to YourApp';
      const emailContent = 'Thank you for signing up!';

      if (!createUserDto.password && !createUserDto.profile_image) {
        return { success: false, message: 'Password or Profile Image is required' }
      }

      if (!createUserDto.password && createUserDto.profile_image) {
        const existingUser = await this.prismaService.user.findUnique({
          where: { email: createUserDto.email },
        });


        if (existingUser) {
          throw new ConflictException('Email is already in use');
        }

        const userData = { ...createUserDto };

        const newUser = await this.prismaService.user.create({
          data: userData,
        });


        await this.sendEmail(newUser.email, emailSubject, emailContent);

        const token = jwt.sign(
          { userId: newUser.id, role: newUser.role },
          TOKEN_KEY,
          { expiresIn: token_expiry }
        );

        const response = {
          timestamp_ms: Date.now(),
          action: 'Sign Up',
          User: {
            token
          },

        };
        return { success: true, message: 'User Created successfully', response };


      }
      else {
        const existingUser = await this.prismaService.user.findUnique({
          where: { email: createUserDto.email },
        });

        if (existingUser) {
          throw new ConflictException('Email is already in use');
        }

        const hashedPassword = await this.hashPassword(createUserDto.password);
        const userData = { ...createUserDto, password: hashedPassword };

        const newUser = await this.prismaService.user.create({
          data: userData,
        });

        await this.sendEmail(newUser.email, emailSubject, emailContent);

        const token = jwt.sign(
          { userId: newUser.id, role: newUser.role },
          TOKEN_KEY,
          { expiresIn: token_expiry }
        );
        const response = {
          timestamp_ms: Date.now(),
          action: 'Sign Up',
          User: {
            token
          },

        };
        return { success: true, message: 'User Created successfully', response };



      }
    } catch (error) {
      if (error instanceof ConflictException) {
        return {
          success: false,
          message: error.message,
        };
      }

      return {
        success: false,
        message: 'An error occurred while creating the user.',
      };
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.prismaService.user.findUnique({
      where: { email: loginUserDto.email },
    });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const passwordMatch = await this.comparePasswords(loginUserDto.password, user.password);

    if (!passwordMatch) {
      return { success: false, message: 'Invalid password' };
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, TOKEN_KEY, { expiresIn: token_expiry });


    const response = {
      timestamp_ms: Date.now(),
      action: 'Logged In',
      User: {
        token
      },

    };
    return { success: true, message: 'User Logged In successfully', response };




  }



  async updateUser(token: string, files: { image?: Express.Multer.File[]; }, updateUserDto: UpdateUserDto) {
    try {
      let parsedIsVerified: boolean;
      let parsedProfileVisibility: boolean;

      if (typeof updateUserDto.profile_visibility === 'string') {
        const stringValue: string = updateUserDto.profile_visibility;
        parsedProfileVisibility = stringValue.toLowerCase() === 'true';
      } else {
        parsedProfileVisibility = updateUserDto.profile_visibility;
      }


      if (typeof updateUserDto.isVerified === 'string') {
        const stringValue: string = updateUserDto.isVerified;
        parsedIsVerified = stringValue.toLowerCase() === 'true';
      } else {
        parsedIsVerified = updateUserDto.isVerified;
      }

      if (files.image) {
        const allowedImageTypes = ['.png', '.jpeg', '.jpg'];
        for (const file of files.image) {
          const ext = extname(file.originalname);
          if (!allowedImageTypes.includes(ext)) {
            throw new HttpException('Invalid image file type.', HttpStatus.BAD_REQUEST);
          }
        }


        const maxFileSize = 4 * 1024 * 1024;
        for (const file of [...(files.image || [])]) {
          if (file.size > maxFileSize) {
            throw new HttpException('File size exceeds the limit.', HttpStatus.BAD_REQUEST);
          }
        }
      }

      const verificationResult = this.verifyTokenAndGetUserId(token);
      if (!(await verificationResult).success) {
        return { success: false, message: 'Invalid access token' };
      }
      const userId = (await verificationResult).userId;






      const existingUser = await this.prismaService.user.findUnique({
        where: { id: parseInt(userId, 10) },
      });

      if (!existingUser) {
        throw new NotFoundException('User not found');
      }


      const allowedFields = ['first_name', 'last_name', 'email', 'mobile_number', 'landline_number', 'country', 'address', 'profile_image', 'role', , 'whatsapp', 'social_id', 'isVerified', 'profile_visibility'];
      const invalidFields = Object.keys(updateUserDto).filter(field => !allowedFields.includes(field));

      if (invalidFields.length > 0) {
        throw new Error(`Invalid fields: ${invalidFields.join(', ')}`);
      }


      let updatedUserDto: any = { ...updateUserDto };

      if (files.image) {
        const processedImages = await Promise.all(files.image.map(file => this.processSingleImage(file)));
        const imagePathsString = processedImages.map(image => image.savedImagePath).join(', ');

        updatedUserDto = { ...updatedUserDto, profile_image: imagePathsString };
        updatedUserDto = { ...updatedUserDto, profile_visibility: parsedProfileVisibility };
        updatedUserDto = { ...updatedUserDto, isVerified: parsedIsVerified };
        updatedUserDto = { ...updatedUserDto, updated_at: new Date() };
        const results = await this.prismaService.user.update({
          where: { id: parseInt(userId, 10) },
          data: updatedUserDto,
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            mobile_number: true,
            landline_number: true,
            whatsapp: true,
            country: true,
            address: true,
            isVerified: true,
            social_id: true,
            role: true,
            profile_image: true,
            profile_visibility: true,
            created_at: true,
            updated_at: true,
          },
        });


        const response = {
          timestamp_ms: Date.now(),
          action: 'update',
          Property: {
            results
          },

        };
        return { success: true, message: 'User updated successfully', response };

      }
      
      else {
        updatedUserDto = { ...updateUserDto, isVerified: parsedIsVerified };
        updatedUserDto = { ...updatedUserDto, profile_visibility: parsedProfileVisibility };
        updatedUserDto = { ...updatedUserDto, updated_at: new Date() };
        const results = await this.prismaService.user.update({
          where: { id: parseInt(userId, 10) },
          data: updatedUserDto,
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            mobile_number: true,
            landline_number: true,
            whatsapp: true,
            country: true,
            address: true,
            isVerified: true,
            social_id: true,
            role: true,
            profile_image: true,
            profile_visibility: true,
            created_at: true,
            updated_at: true,
          },
        });


        const response = {
          timestamp_ms: Date.now(),
          action: 'update',
          User: {
            results
          },

        };
        return { success: true, message: 'User updated successfully', response };
      }
    }
    catch (error) {

      return {
        success: false,
        message: 'An error occurred while updating the user.'+error.message,
      };
    }
  }
  async verifyTokenAndGetUserId(token: string): Promise<{ success: boolean; userId?: string; }> {
    try {
      const decodedToken = jwt.verify(token, TOKEN_KEY);

      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decodedToken.exp && decodedToken.exp < currentTimestamp) {
        return { success: false, userId: undefined };
      }

      const userId = decodedToken.userId;

      return { success: true, userId: userId };
    } catch (error) {
      console.error('Error verifying token:', error.message);
      return { success: false, userId: undefined };
    }
  }


  async resetPassword(token: string, resetPasswordDto: ResetPasswordDto) {
    try {
      const verificationResult = this.verifyTokenAndGetUserId(token);
      if (!(await verificationResult).success) {
        return { success: false, message: 'Invalid access token' };
      }
      const userId = (await verificationResult).userId;




      const existingUser = await this.prismaService.user.findUnique({
        where: { id: parseInt(userId, 10) },
      });

      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      let updatedUserDto: any = { ...resetPasswordDto };

      if (resetPasswordDto.oldPassword && resetPasswordDto.password) {
        const passwordMatch = await this.comparePasswords(resetPasswordDto.oldPassword, existingUser.password);


        if (!passwordMatch) {
          return {
            success: false,
            message: 'Invalid old password',
          };
        }

        const hashedPassword = await this.hashPassword(resetPasswordDto.password);
        updatedUserDto = { ...resetPasswordDto, password: hashedPassword };
        delete updatedUserDto.oldPassword;




      }
      updatedUserDto = { ...updatedUserDto, updated_at: new Date() };

      await this.prismaService.user.update({
        where: { id: parseInt(userId, 10) },
        data: updatedUserDto,

      });
      const emailContent = `Dear ${existingUser.first_name} ${existingUser.last_name},\n\nYour password has been successfully updated. If you did not perform this action, please contact us immediately.`;
      await this.sendEmail(existingUser.email, 'Password Update Notification', emailContent);


      const response = {
        timestamp_ms: Date.now(),
        action: 'Password Update',

      };
      return { success: true, message: 'Password updated successfully', response };


    } catch (error) {

      return {
        success: false,
        message: 'An error occurred while updating the user.',
      };
    }




  }



  private async processSingleImage(file: Express.Multer.File): Promise<any> {
    const buffer = await Sharp(file.buffer)
      .resize({ width: 600, height: 500, fit: 'cover' })
      .toBuffer();
      const savedImagePath = await saveImageToDisk(buffer, file.originalname);


    return {
      ...file,
      savedImagePath,
    };
  }



}

