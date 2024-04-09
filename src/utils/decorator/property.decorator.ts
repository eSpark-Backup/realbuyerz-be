/* eslint-disable prettier/prettier */
// utils/decorators/property.decorators.ts

import { SetMetadata } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CreatePropertyDto } from 'src/Property/dto/create-property.dto';
import { updatedPropertyDto } from 'src/Property/dto/update-property.dto';

export const CreateApiDocs = (): MethodDecorator => {
  const decorators = [
    ApiOperation({ summary: 'Create a new property' }),
    ApiBody({ type: CreatePropertyDto }),
    ApiResponse({ status: 200, description: 'Property created successfully' }),
    ApiResponse({ status: 400, description: 'Bad Request' }),
  ];

  return (target, key, descriptor) => {
    decorators.forEach(decorator => decorator(target, key, descriptor));
    SetMetadata('apiDocs', decorators)(target, key, descriptor);
  };
};

export const UpdateApiDocs = (): MethodDecorator => {
  const decorators = [
    ApiOperation({ summary: 'Update an existing property' }),
    ApiBody({ type: updatedPropertyDto }),
    ApiResponse({ status: 200, description: 'Property updated successfully' }),
    ApiResponse({ status: 400, description: 'Bad Request' }),
    ApiResponse({ status: 404, description: 'Property not found' }),
  ];

  return (target, key, descriptor) => {
    decorators.forEach(decorator => decorator(target, key, descriptor));
    SetMetadata('apiDocs', decorators)(target, key, descriptor);
  };
};

export const FindAllApiDocs = (): MethodDecorator => {
    const decorators = [
      ApiOperation({ summary: 'Find all properties' }),
      ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' }),
      ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Number of items per page' }),
      ApiQuery({ name: 'purpose', required: false, type: String, description: 'Property purpose' }),
      ApiQuery({ name: 'propertyType', required: false, type: String, description: 'Property type' }),
      ApiQuery({ name: 'subType', required: false, type: String, description: 'Property sub-type' }),
      ApiQuery({ name: 'propertyCity', required: false, type: String, description: 'Property city' }),
      ApiResponse({ status: 200, description: 'Properties retrieved successfully' }),
      ApiResponse({ status: 400, description: 'Bad Request' }),
    ];
  
    return (target, key, descriptor) => {
      decorators.forEach(decorator => decorator(target, key, descriptor));
      SetMetadata('apiDocs', decorators)(target, key, descriptor);
    };
  };