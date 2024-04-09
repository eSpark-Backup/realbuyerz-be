/* eslint-disable prettier/prettier */
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { generateResponse } from '../function/response';

@Injectable()
export class SuccessResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const action = data.hasOwnProperty('action') ? data.action : 'Success';
        const message = data.hasOwnProperty('message') ? data.message : 'Success';

        // If 'success' property is not explicitly set in the response data
        // and 'data' is null or undefined, consider it as a failure
        const success = data.hasOwnProperty('success') ? data.success : !!data.data;

        const modifiedResponse = generateResponse(
          action,
          message,
          data.data ?? null,
          'data'
        );
        modifiedResponse.success = success;

        return modifiedResponse;
      }),
    );
  }
}

