/* eslint-disable prettier/prettier */
// utils/decorators/user.decorators.ts

import { SetMetadata } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../User/dto/create-user.dto';
import { LoginUserDto } from '../User/dto/login-user.dto';
import { EmailDto } from 'src/User/dto/reset-email.dto';
import { SendOtpDto } from 'src/User/dto/send-otp.dto';
import { VerifyOtpDto } from 'src/User/dto/verify-otp.dto';

export const CreateUserApiDocs = () => [
  ApiOperation({ summary: 'Create a new user' }),
  ApiBody({ type: CreateUserDto }),
  ApiResponse({ status: 201, description: 'User created successfully' }),
  ApiResponse({ status: 400, description: 'Bad Request' }),
];

export const LoginUserApiDocs = () => [
  ApiOperation({ summary: 'Login user' }),
  ApiBody({ type: LoginUserDto }),
  ApiResponse({ status: 200, description: 'Login successful' }),
  ApiResponse({ status: 401, description: 'Unauthorized' }),
  ApiResponse({ status: 400, description: 'Bad Request' }),
];

export const SendEmailApiDocs = () => [
  ApiOperation({ summary: 'Send email' }),
  ApiBody({ type: EmailDto }),
  ApiResponse({ status: 200, description: 'Email sent successfully' }),
  ApiResponse({ status: 400, description: 'Bad Request' }),
];

export const CreateUserDocs = () => {
  const decorators = CreateUserApiDocs();
  return (target, key, descriptor) => {
    decorators.forEach(decorator => decorator(target, key, descriptor));
    SetMetadata('apiDocs', decorators)(target, key, descriptor);
  };
};

export const LoginUserDocs = () => {
  const decorators = LoginUserApiDocs();
  return (target, key, descriptor) => {
    decorators.forEach(decorator => decorator(target, key, descriptor));
    SetMetadata('apiDocs', decorators)(target, key, descriptor);
  };
};
export const SendEmailDocs = () => {
  const decorators = SendEmailApiDocs();
  return (target, key, descriptor) => {
    decorators.forEach(decorator => decorator(target, key, descriptor));
    SetMetadata('apiDocs', decorators)(target, key, descriptor);
  };
};


export const SendOtpApiDocs = () => [
  ApiOperation({ summary: 'Send OTP' }),
  ApiBody({ type: SendOtpDto }),
  ApiResponse({ status: 200, description: 'OTP sent successfully' }),
  ApiResponse({ status: 400, description: 'Bad Request' }),
];

export const SendOtpDocs = () => {
  const decorators = SendOtpApiDocs();
  return (target, key, descriptor) => {
    decorators.forEach(decorator => decorator(target, key, descriptor));
    SetMetadata('apiDocs', decorators)(target, key, descriptor);
  };
};


export const VerifyOtpApiDocs = () => [
  ApiOperation({ summary: 'Verify OTP' }),
  ApiBody({ type: VerifyOtpDto }),
  ApiResponse({ status: 200, description: 'OTP verified successfully' }),
  ApiResponse({ status: 400, description: 'Bad Request' }),
];


export const VerifyOtpDocs = () => {
  const decorators = VerifyOtpApiDocs();
  return (target, key, descriptor) => {
    decorators.forEach(decorator => decorator(target, key, descriptor));
    SetMetadata('apiDocs', decorators)(target, key, descriptor);
  };
};