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

import * as  Sharp from 'sharp';
import * as otpGenerator from 'otp-generator';
import * as crypto from 'crypto';
import * as Twilio from 'twilio';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordwithMailDto } from './dto/reset-pw-with-mail.dto';
import { extname } from 'path';

const TOKEN_KEY = process.env.TOKEN_KEY;
const key = process.env.OTP_KEY;
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const token_expiry = process.env.TOKEN_EXPIRY;

@Injectable()
export class UserService {
  private twilioClient: Twilio.Twilio;
  constructor(private readonly prismaService: PrismaService) {
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
  async resetPasswordwithMail(userEmail: string, resetPasswordwithMailDto: ResetPasswordwithMailDto) {
    try {
      const { password } = resetPasswordwithMailDto;

      const user = await this.prismaService.user.findUnique({
        where: { email: userEmail },
      });

      if (!user) {
        return { success: false, message: 'User not found' };
      }


      const hashedPassword = await this.hashPassword(password);

      await this.prismaService.user.update({
        where: { email: userEmail },
        data: { password: hashedPassword },
      });

      return { success: true, message: 'Password reset successfully' };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to reset password. Please try again later.' };
    }
  }

  async sendpasswordResetEmail(to: string): Promise<void> {
    const token = jwt.sign({ email: to }, TOKEN_KEY, { expiresIn: token_expiry });
    console.log(token);
    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    try {
      const msg = {
        to,
        from: 'muhammadahsanty@gmail.com',
        subject: 'Password Reset Link',
        text: link,
        html: `<p>Do not Share it with anyone</p>`,
      };

      await sgMail.send(msg);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
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
        from: 'muhammadahsanty@gmail.com',
        subject,
        text: content,
        html: `<p>${content}</p>`,
      };

      await sgMail.send(msg);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send emaiil');
    }
  }
  async createUser(createUserDto: CreateUserDto) {
    try {
      const emailSubject = 'Welcome to YourApp';
        const emailContent = 'Thank you for signing up!';

      if(!createUserDto.password && createUserDto.profile_image ){
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
  
        return {
          id: newUser.id,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          email: newUser.email,
          mobile_number: newUser.mobile_number,
          profile_image: newUser.profile_image,
          token: token,
        };


      }
      else{
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

      return {
        id: newUser.id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        mobile_number: newUser.mobile_number,
        token: token,
      };
    }
    } catch (error) {
      if (error instanceof ConflictException) {
        return {
          success: false,
          message: error.message,
        };
      }

      console.error(error);
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


    return { success: true, message: 'Login successful', token };
  }



  async updateUser(userId: string, files: { image?: Express.Multer.File[]; }, updateUserDto: UpdateUserDto) {
    try {

      if (files.image) {
        const allowedImageTypes = ['.png', '.jpeg', '.jpg'];
        for (const file of files.image) {
          const ext = extname(file.originalname);
          if (!allowedImageTypes.includes(ext)) {
            throw new HttpException('Invalid image file type.', HttpStatus.BAD_REQUEST);
          }
        }
      }
      const maxFileSize = 4 * 1024 * 1024;
      for (const file of [...(files.image || [])]) {
        if (file.size > maxFileSize) {
          throw new HttpException('File size exceeds the limit.', HttpStatus.BAD_REQUEST);
        }
      }




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
    }
    catch (error) {
      console.error(error);

      return {
        success: false,
        message: 'An error occurred while updating the user.',
      };
    }
  }


  async resetPassword(userId: string, resetPasswordDto: ResetPasswordDto) {
    try {
      console.log(userId);
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
      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message: 'An error occurred while updating the user.',
      };
    }




  }



  private async processSingleImage(file: Express.Multer.File): Promise<any> {
    console.log('File:', file);
    const buffer = await Sharp(file.buffer)
      .resize({ width: 600, height: 500, fit: 'cover' })
      .toBuffer();
    const savedImagePath = await this.saveImageToDisk(buffer, file.originalname);

    return {
      ...file,
      savedImagePath,
    };
  }

  private async saveImageToDisk(buffer: Buffer, filename: string): Promise<string> {
    function generateRandomUUID(): string {
      return uuid.v4();
    }
    const randomUUID = generateRandomUUID();
    const destinationFolder = 'upload';
    const filePath = path.join(destinationFolder, `${randomUUID}_${filename}`);

    await fsPromises.writeFile(filePath, buffer);
    return filePath;
  }

}

