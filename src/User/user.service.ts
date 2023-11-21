/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as jwt from 'jsonwebtoken';
import { UpdateUserDto } from './dto/update-user.dto';
const TOKEN_KEY = "BADAMI";

@Injectable()
@ApiTags('user')
export class UserService {
    constructor(private readonly prismaService: PrismaService) { }

    @ApiOperation({ summary: 'Create a new user' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async createUser(createUserDto: CreateUserDto) {
        try {
            const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

            const userData = { ...createUserDto, password: hashedPassword };

            return await this.prismaService.user.create({
                data: userData,
            });
        } catch (error) {
            return {
                success: false,
                message: 'An error occurred while creating the user.',
            };
        }
    }

    @ApiOperation({ summary: 'User login' })
    @ApiBody({ description: 'User login credentials', type: LoginUserDto })
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
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
            // Check if the user exists
            const existingUser = await this.prismaService.user.findUnique({
                where: { id: parseInt(userId, 10) },
            });

            if (!existingUser) {
                throw new NotFoundException('User not found');
            }

            // Check for invalid fields in the request body
            const allowedFields = ['firstName', 'lastName', 'email', 'mobileNumber', 'landlineNumber', 'countryAddress', 'password', 'profileImage', 'role', 'oldPassword'];
            const invalidFields = Object.keys(updateUserDto).filter(field => !allowedFields.includes(field));

            if (invalidFields.length > 0) {
                throw new Error(`Invalid fields: ${invalidFields.join(', ')}`);
            }
// eslint-disable-next-line no-var
var updatedUserDto = updateUserDto;
            // If the oldPassword and password are included, verify the old password
            if (updateUserDto.oldPassword && updateUserDto.password) {
                const passwordMatch = await bcrypt.compare(updateUserDto.oldPassword, existingUser.password);

                if (!passwordMatch) {
                    return {
                        success: false,
                        message: 'Invalid old password',
                    };
                }

                const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
                 updatedUserDto = { ...updateUserDto, password: hashedPassword };
                 
            }

            // Update the user
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
