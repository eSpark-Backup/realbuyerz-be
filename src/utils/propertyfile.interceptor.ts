/* eslint-disable prettier/prettier */
// file.interceptor.ts
import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

export const propertyImageFileInterceptor = FileFieldsInterceptor(
  [{ name: 'image', maxCount: 5 }],
  {
    fileFilter: (req, file, cb) => {
      const allowedImageTypes = ['.png', '.jpeg', '.jpg'];

      const ext = extname(file.originalname);

      if (file.fieldname === 'image' && allowedImageTypes.includes(ext)) {
        cb(null, true);
      } else {
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
);
