/* eslint-disable prettier/prettier */
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UpdateUserDto } from './dto/update-user.dto';
import sgMail = require('@sendgrid/mail');

import * as otpGenerator from 'otp-generator';
import * as crypto from 'crypto';
import * as Twilio from 'twilio';

const TOKEN_KEY = process.env.TOKEN_KEY ;
const key = process.env.OTP_KEY; 
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID; 
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN; 
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER; 

@Injectable()
export class UserService {
    private twilioClient: Twilio.Twilio;
    constructor(private readonly prismaService: PrismaService) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        this.twilioClient =  Twilio(twilioAccountSid, twilioAuthToken);

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
          const existingUser = await this.prismaService.user.findUnique({
            where: { email: createUserDto.email },
          });
    
          if (existingUser) {
            throw new ConflictException('Email is already in use');
          }
    
          const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
          const userData = { ...createUserDto, password: hashedPassword };
    
          const newUser = await this.prismaService.user.create({
            data: userData,
          });
    
          const token = jwt.sign(
            { userId: newUser.id, role: newUser.role },
            TOKEN_KEY,
            { expiresIn: '1h' }
          );
    
          return {
            id: newUser.id,
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            mobile_number: newUser.mobile_number,
            token: token,
          };
        } catch (error) {
          // Handle specific exceptions
          if (error instanceof ConflictException) {
            return {
              success: false,
              message: error.message,
            };
          }
    
          // Handle other errors
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

        const passwordMatch = await bcrypt.compare(loginUserDto.password, user.password);

        if (!passwordMatch) {
            return { success: false, message: 'Invalid password' };
        }
        const token = jwt.sign({ userId: user.id, role: user.role }, TOKEN_KEY, { expiresIn: '1h' });


        return { success: true, message: 'Login successful', token };
    }

    async updateUser(userId: string, updateUserDto: UpdateUserDto) {
        try {
            const existingUser = await this.prismaService.user.findUnique({
                where: { id: parseInt(userId, 10) },
            });

            if (!existingUser) {
                throw new NotFoundException('User not found');
            }

            const allowedFields = ['first_name', 'last_name', 'email', 'mobile_number', 'landline_number', 'country' ,'address', 'password', 'profile_image', 'role', 'oldPassword','whatsapp','social_id','isVerified','profile_visibility'];
            const invalidFields = Object.keys(updateUserDto).filter(field => !allowedFields.includes(field));

            if (invalidFields.length > 0) {
                throw new Error(`Invalid fields: ${invalidFields.join(', ')}`);
            }
// eslint-disable-next-line no-var
let updatedUserDto: any = { ...updateUserDto };

            if (updateUserDto.oldPassword && updateUserDto.password) {
                const passwordMatch = await bcrypt.compare(updateUserDto.oldPassword, existingUser.password);

                if (!passwordMatch) {
                    return {
                        success: false,
                        message: 'Invalid old password',
                    };
                }

                const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
                   updatedUserDto = { ...updatedUserDto, password: hashedPassword};
                   delete updatedUserDto.oldPassword;


                 
            }
            updatedUserDto = { ...updatedUserDto, updated_at: new Date() };

            return await this.prismaService.user.update({
                where: { id: parseInt(userId, 10) },
                data: updatedUserDto,
            });
        } catch (error) {
            console.error(error);

            return {
                success: false,
                message: 'An error occurred while updating the user.',
            };
        }
    }


    
}
