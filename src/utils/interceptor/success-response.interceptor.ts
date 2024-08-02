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
        const action = data?.action || 'Success';
        const message = data?.message || 'Success';
        const success =
          data?.success !== undefined ? data.success : !!data?.data;
        const error = data?.error || null;

        const modifiedResponse = generateResponse(
          action,
          message,
          data?.data ?? null,
          'data',
        );

        // Manually add the error property
        return {
          ...modifiedResponse,
          success: success,
          error: error,
        };
      }),
    );
  }
}
