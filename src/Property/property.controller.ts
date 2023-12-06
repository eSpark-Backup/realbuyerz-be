/* eslint-disable prettier/prettier */
import {  Body, Controller, DefaultValuePipe, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post,Put,Query,UploadedFiles,UseInterceptors } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PropertyService } from "./property.service";
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { extname } from "path";
import { CreatePropertyDto } from "./dto/create-property.dto";
import { updatedPropertyDto } from "./dto/update-property.dto";
import multer from "multer";

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
       @Body() createProperty:CreatePropertyDto,
       ) {
        try {
          const result = await this.propertyService.createProperty(files,createProperty);
          return result;
      } catch (error) {
          
          console.error('Error processing property creation:', error.message);
          return { message: 'Failed to Create Property',status: HttpStatus.INTERNAL_SERVER_ERROR, error: error.message };
      }
    }



    @Put('/:id')
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
    async updateProperty(@Param('id') property_id: string,
        @UploadedFiles()
        files: {
          image?: Express.Multer.File[];
          video?: Express.Multer.File[];
        },
        @Body() updateProperty:updatedPropertyDto,
       ) {
        try {
          const result = await this.propertyService.updateProperty(property_id, files, updateProperty);
          return result;
      } catch (error) {
          
          console.error('Error processing property updation:', error);
          throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }


    @Get()
    async findAll(
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
      @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    ) {
      return this.propertyService.findAll(page, pageSize);
    }
    



}


