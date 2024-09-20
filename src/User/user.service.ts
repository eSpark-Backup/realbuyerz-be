/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as jwt from 'jsonwebtoken';
import { UpdateUserDto } from './dto/update-user.dto';
import sgMail = require('@sendgrid/mail');
import * as CryptoJS from 'crypto-js';
import { PBKDF2, SHA256 } from 'crypto-js';
import * as uuid from 'uuid';
import * as path from 'path';
import { promises as fsPromises } from 'fs';
import axios from 'axios';
import * as Sharp from 'sharp';
import * as otpGenerator from 'otp-generator';
import * as crypto from 'crypto';
import * as Twilio from 'twilio';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordwithMailDto } from './dto/reset-pw-with-mail.dto';
import { extname } from 'path';
import { OAuth2Client } from 'google-auth-library';
import { saveImageToDisk } from '../utils/function/saveImage';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { CONSTANT_RESPONSE } from 'src/utils/constant/return.constant';
import { BackblazeService } from 'src/utils/function/backblaze';
import { UpsertPreferencesDto } from './dto/upsert-prefrences.dto';

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

  constructor(
    private jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly backblazeService: BackblazeService,
  ) {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    this.twilioClient = Twilio(twilioAccountSid, twilioAuthToken);
  }
  async hashPassword(password: string): Promise<string> {
    const iterations = 10000;
    const derivedKey = PBKDF2(password, process.env.PW_KEY, {
      keySize: 256 / 32,
      iterations,
    });
    const hashedPassword = derivedKey.toString();
    return hashedPassword;
  }

  async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const iterations = 10000;
    const derivedKey = PBKDF2(plainPassword, process.env.PW_KEY, {
      keySize: 256 / 32,
      iterations,
    });
    const enteredPasswordHash = derivedKey.toString();
    return enteredPasswordHash === hashedPassword;
  }

  async resetPasswordwithMail(
    token: string,
    resetPasswordwithMailDto: ResetPasswordwithMailDto,
  ) {
    try {
      const { email, exp } = jwt.verify(token, TOKEN_KEY) as {
        email: string;
        exp?: number;
      };

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
      if (!user.passwordResetToken || user.passwordResetToken !== token) {
        return {
          success: false,
          message: 'Password reset link is expired or invalid',
        };
      }

      const hashedPassword = await this.hashPassword(password);

      await this.prismaService.user.update({
        where: { email: email },
        data: {
          password: hashedPassword,
          passwordResetToken: null,
        },
      });

      return {
        action: 'Reset Password With Link',
        message: CONSTANT_RESPONSE.PWD_RESET_SUCCESS,
      };
    } catch (error) {
      return {
        success: false,
        message: CONSTANT_RESPONSE.FAILED_TO_RESET,
        error,
      };
    }
  }

  async sendpasswordResetEmail(to: string) {
    const token = jwt.sign({ email: to }, TOKEN_KEY, {
      expiresIn: token_expiry,
    });
    const link = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    try {
      const findUser = await this.prismaService.user.findUnique({
        where: { email: to },
      });

      if (!findUser) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      await this.prismaService.user.update({
        where: { email: to },
        data: { passwordResetToken: token },
      });

      await this.sendEmail(to, 'Password Reset Link', link);

      return {
        success: true,
        message: 'Password reset link sent successfully',
      };
    } catch (error) {
      throw new Error('Failed to send password reset email');
    }
  }

  // async googleLogin(accessToken: string): Promise<{ token: any }> {
  //   const userInfo = await this.verifyGoogleAccessToken(accessToken);

  //   if (!userInfo || userInfo.success === false) {
  //     throw new HttpException('Failed to Verify Google Access Token', HttpStatus.UNAUTHORIZED);

  //   }

  //   const user = await this.prismaService.user.findUnique({ where: { email: userInfo.email } });

  //   if (user) {
  //     const token = this.generateJwtToken(user);

  //     return { token };

  //   } else {
  //     throw new Error('User not found');
  //   }
  // }

  // async verifyGoogleAccessToken(accessToken: string): Promise<any> {
  //   try {
  //     const response = await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`);
  //     const tokenInfo = response.data;

  //     return tokenInfo;
  //   } catch (error) {
  //     return false;

  //   }
  // }

  async verifyOtp(phone: string, otp: string, hash: string): Promise<any> {
    try {
      const [hashValue, expires] = hash.split('.');
      const now = Date.now();

      if (now > parseInt(expires)) {
        throw new Error('OTP Expired');
      }

      const data = `${phone}.${otp}.${expires}`;
      const newCalculateHash = crypto
        .createHmac('sha256', key)
        .update(data)
        .digest('hex');

      if (newCalculateHash === hashValue) {
        const user = await this.prismaService.user.update({
          where: { mobileNumber: phone },
          data: {
            isVerified: true,
          },
        });

        return {
          success: true,
          message: CONSTANT_RESPONSE.VERIFIED_SUCCESSFULLY,
          response: user,
        };
      }

      throw new Error('Invalid OTP');
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async upsertPreferences(
    upsertPreferencesDto: UpsertPreferencesDto,
    userId: string,
  ) {
    const preferencesData = upsertPreferencesDto;

    const result = await this.prismaService.preferences.upsert({
      where: { userId },
      update: preferencesData,
      create: { ...preferencesData, userId },
    });
    if (result) {
      return {
        success: true,
        message: CONSTANT_RESPONSE.UPDATED_SUCCESSFULLY,
        data: result,
      };
    } else {
      return {
        success: false,
        message: CONSTANT_RESPONSE.UPDATE_FAILED,
      };
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
        from: 'RealBuyerz <ahsansaleem@esparkconsultants.com>',
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

      if (!createUserDto.password && !createUserDto.profileImage) {
        return {
          success: false,
          message: 'Password or Profile Image is required',
        };
      }

      if (
        !createUserDto.password &&
        createUserDto.profileImage &&
        createUserDto.socialId
      ) {
        const existingUser = await this.prismaService.user.findFirst({
          where: {
            AND: [{ email: createUserDto.email }, { socialLogin: true }],
          },
        });

        if (existingUser) {
          const token = this.createToken(
            { id: existingUser.id, role: existingUser.role },
            existingUser,
          );
          return {
            action: 'Socially Logged In',
            message: CONSTANT_RESPONSE.LOGIN_SUCCESS,
            data: {
              token: token,
            },
          };
        }

        const userData = { ...createUserDto };
        userData.socialLogin = true;

        const newUser = await this.prismaService.user.create({
          data: userData,
        });
        await this.sendEmail(newUser.email, emailSubject, emailContent);
        const token = this.createToken(
          { id: newUser.id, role: newUser.role },
          newUser,
        );
        const signUpResponse = {
          action: 'Socially Signed Up',
          message: CONSTANT_RESPONSE.CREATED_SUCCESSFULLY,
          data: {
            token: token,
          },
        };

        return signUpResponse;
      } else {
        const existingUser = await this.prismaService.user.findFirst({
          where: {
            OR: [
              { email: createUserDto.email },
              { mobileNumber: createUserDto.mobileNumber },
            ],
          },
        });

        if (existingUser) {
          throw new ConflictException(
            'Email or Mobile Number is already in use',
          );
        }

        if (createUserDto.role == 'admin') {
          const hashedPassword = await this.hashPassword(
            createUserDto.password,
          );
          const userData = { ...createUserDto, password: hashedPassword };
          const newUser = await this.prismaService.user.create({
            data: userData,
          });
          const token = this.createToken(
            { id: newUser.id, role: newUser.role },
            newUser,
          );
          return {
            action: 'Admin Created',
            message: CONSTANT_RESPONSE.CREATED_SUCCESSFULLY,
            data: {
              token: token,
            },
          };
        }
        if (createUserDto.socialId || createUserDto.profileImage) {
          return {
            success: false,
            message: 'Social Id or Profile Image is not required',
          };
        }

        if (createUserDto.mobileNumber == null) {
          return {
            success: false,
            message: 'Mobile Number is required',
          };
        }

        const hashedPassword = await this.hashPassword(createUserDto.password);
        const userData = { ...createUserDto, password: hashedPassword };

        const newUser = await this.prismaService.user.create({
          data: userData,
        });

        await this.sendEmail(newUser.email, emailSubject, emailContent);

        const token = this.createToken(
          { id: newUser.id, role: newUser.role },
          newUser,
        );

        const signUpResponse = {
          action: 'Sign Up',
          message: CONSTANT_RESPONSE.CREATED_SUCCESSFULLY,
          data: token,
        };

        return signUpResponse;
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        return {
          action: 'User not created',
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
  async getUserProfile(userId: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          landlineNumber: true,
          city: true,
          bio: true,
          whatsapp: true,
          country: true,
          address: true,
          isVerified: true,
          socialId: true,
          profileImage: true,
          profileVisibility: true,
          preferences: {
            select: {
              emailNotification: true,
              newsLetter: true,
              automatedReport: true,
              currency: true,
              areaUnit: true,
            },
          },
        },
      });

      const fileName = user.profileImage.split(
        `${process.env.BUCKET_NAME}/`,
      )[1];
      // Generate a signed URL for the image
      const signedUrl = await this.backblazeService.generateSignedUrl(fileName);

      // Replace the public URL with the signed URL
      user.profileImage = signedUrl;

      if (!user) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      return {
        action: 'Get Profile',
        message: CONSTANT_RESPONSE.GET_ALL,
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: 'An error occurred while fetching the user profile.',
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
    if (user.socialLogin == true) {
      return { success: false, message: 'Please login with social login' };
    }

    const passwordMatch = await this.comparePasswords(
      loginUserDto.password,
      user.password,
    );

    if (!passwordMatch) {
      return { success: false, message: 'Invalid password' };
    }
    const token = this.createToken({ id: user.id, role: user.role }, user);

    return {
      action: 'Login',
      message: CONSTANT_RESPONSE.LOGIN_SUCCESS,
      data: token,
    };
  }

  async updateUser(
    userId: string,
    files: { image?: Express.Multer.File[] },
    updateUserDto: UpdateUserDto,
  ) {
    try {
      let parsedIsVerified: boolean;
      let parsedProfileVisibility: boolean;

      if (typeof updateUserDto.profileVisibility === 'string') {
        const stringValue: string = updateUserDto.profileVisibility;
        parsedProfileVisibility = stringValue.toLowerCase() === 'true';
      } else {
        parsedProfileVisibility = updateUserDto.profileVisibility;
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
            throw new HttpException(
              'Invalid image file type.',
              HttpStatus.BAD_REQUEST,
            );
          }
        }

        const maxFileSize = 4 * 1024 * 1024;
        for (const file of [...(files.image || [])]) {
          if (file.size > maxFileSize) {
            throw new HttpException(
              'File size exceeds the limit.',
              HttpStatus.BAD_REQUEST,
            );
          }
        }
      }

      const existingUser = await this.prismaService.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      const allowedFields = [
        'firstName',
        'lastName',
        'landlineNumber',
        'country',
        'address',
        'profileImage',
        'whatsapp',
        'socialId',
        'bio',
        'isVerified',
        'city',
        'profileVisibility',
      ];
      const invalidFields = Object.keys(updateUserDto).filter(
        (field) => !allowedFields.includes(field),
      );

      if (invalidFields.length > 0) {
        throw new Error(`Invalid fields: ${invalidFields.join(', ')}`);
      }

      let updatedUserDto: any = { ...updateUserDto };

      if (files.image) {
        if (existingUser.profileImage) {
          const fileName = path.basename(
            new URL(existingUser.profileImage).pathname,
          );
          await this.backblazeService.deleteFile(
            fileName,
            existingUser.imageKey,
          );
        }
        const processedImages = await Promise.all(
          files.image.map((file) => this.processSingleImage(file)),
        );

        updatedUserDto = {
          ...updatedUserDto,
          profileImage: processedImages
            .map((image) => image.uploadResult.url)
            .join(''),

          imageKey: processedImages
            .map((image) => image.uploadResult.fileId)
            .join(''),
        };
        updatedUserDto = {
          ...updatedUserDto,
          profileVisibility: parsedProfileVisibility,
        };
        updatedUserDto = { ...updatedUserDto, isVerified: parsedIsVerified };
        // updatedUserDto = { ...updatedUserDto, updated_at: new Date() };
        const results = await this.prismaService.user.update({
          where: { id: userId },
          data: updatedUserDto,
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            landlineNumber: true,
            bio: true,
            whatsapp: true,
            country: true,
            address: true,
            city: true,
            isVerified: true,
            socialId: true,
            profileImage: true,
            profileVisibility: true,
          },
        });

        const updateResponse = {
          action: 'Update',
          message: 'User updated successfully',
          data: results,
        };

        return updateResponse;
      } else {
        updatedUserDto = { ...updateUserDto, isVerified: parsedIsVerified };
        updatedUserDto = {
          ...updatedUserDto,
          profileVisibility: parsedProfileVisibility,
        };
        // updatedUserDto = { ...updatedUserDto, updated_at: new Date() };
        const results = await this.prismaService.user.update({
          where: { id: userId },
          data: updatedUserDto,
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            bio: true,
            landlineNumber: true,
            whatsapp: true,
            country: true,
            address: true,
            city: true,
            isVerified: true,
            socialId: true,
            role: true,
            profileImage: true,
            profileVisibility: true,
          },
        });

        const updateResponse = {
          action: 'Update',
          message: CONSTANT_RESPONSE.UPDATED_SUCCESSFULLY,
          data: results,
        };

        return updateResponse;
      }
    } catch (error) {
      return {
        success: false,
        message: 'An error occurred while updating the user.' + error.message,
      };
    }
  }

  async resetPassword(userId: string, resetPasswordDto: ResetPasswordDto) {
    try {
      const existingUser = await this.prismaService.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      let updatedUserDto: any = { ...resetPasswordDto };

      if (resetPasswordDto.oldPassword && resetPasswordDto.password) {
        const passwordMatch = await this.comparePasswords(
          resetPasswordDto.oldPassword,
          existingUser.password,
        );

        if (!passwordMatch) {
          return {
            success: false,
            message: 'Invalid old password',
          };
        }

        const hashedPassword = await this.hashPassword(
          resetPasswordDto.password,
        );
        updatedUserDto = { ...resetPasswordDto, password: hashedPassword };
        delete updatedUserDto.oldPassword;
      }
      updatedUserDto = { ...updatedUserDto, updatedAt: new Date() };

      await this.prismaService.user.update({
        where: { id: userId },
        data: updatedUserDto,
      });
      const emailContent = `Dear ${existingUser.firstName} ${existingUser.lastName},\n\nYour password has been successfully updated. If you did not perform this action, please contact us immediately.`;
      await this.sendEmail(
        existingUser.email,
        'Password Update Notification',
        emailContent,
      );

      const passwordUpdateResponse = {
        action: 'Update Password',
        message: CONSTANT_RESPONSE.UPDATED_SUCCESSFULLY,
      };

      return passwordUpdateResponse;
    } catch (error) {
      return {
        success: false,
        message: 'An error occurred while updating the user.',
      };
    }
  }

  private async processSingleImage(file: Express.Multer.File): Promise<any> {
    const watermarkPath = 'src/utils/watermark/Quote.png';

    const buffer = await Sharp(file.buffer)
      .resize({ width: 600, height: 500, fit: 'cover' })
      // .composite([
      //   { input: await readFile(resolve(watermarkPath)), gravity: 'center' },
      // ])
      .png()
      .toBuffer();

    const uploadResult = await this.backblazeService.uploadFileFromBuffer(
      buffer,
      file.originalname,
    );
    // const savedImagePath = await saveImageToDisk(buffer, file.originalname);

    return {
      ...file,
      uploadResult,
    };
  }

  createToken(payload: object, userObj: any) {
    const token = this.jwtService.sign(payload);
    let user = {
      userName: userObj?.firstName + ' ' + userObj?.lastName,
      email: userObj?.email,
      role: userObj?.role,
    };

    return { token, user };
  }
  async validateUser(payload: any) {
    const { id } = payload;
    const findUser = await this.prismaService.user.findUnique({
      where: { id: id },
    });
    return findUser;
  }
}
