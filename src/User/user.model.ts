/* eslint-disable prettier/prettier */
// src/user/user.model.ts

export interface UserModel {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    landlineNumber: string | null;
    countryAddress: string;
    Address: string;
    password: string;
    role: string;
    profileImage: string | null;
    // ... other properties
  }
  