/* eslint-disable prettier/prettier */
import {  Controller, HttpException, HttpStatus, Post,Req,UploadedFiles,UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PropertyService } from "./property.service";
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { extname } from "path";

@Controller('property')
@ApiTags('property')
export class PropertyController {
    constructor(private readonly propertyService: PropertyService) {}
    @Post()
    @ApiTags('property')
    @UseInterceptors(
        FileFieldsInterceptor([
          { name: 'image', maxCount: 5 },
          { name: 'video', maxCount: 5 },
        ],
          {
            fileFilter: (req, file, cb) => {
              const allowedImageTypes = ['.png', '.jpeg', '.jpg'];
              const allowedVideoTypes = ['.mp4', '.avi', '.mkv']; 
    
              const ext = extname(file.originalname);
    
              if (file.fieldname === 'image' && allowedImageTypes.includes(ext)) {
                cb(null, true);
              } else if (file.fieldname === 'video' && allowedVideoTypes.includes(ext)) {
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
        ),
      )
    async createProperty(
        @UploadedFiles()
        files: {
          image?: Express.Multer.File[];
          video?: Express.Multer.File[];
        },
        @Req() req,
       ) {
        try {
          const result = await this.propertyService.createProperty(req?.user, files, req.body);
          return result;
      } catch (error) {
          
          console.error('Error processing property creation:', error);
          throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }




}
