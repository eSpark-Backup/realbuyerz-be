/* eslint-disable prettier/prettier */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class OptionalRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);
    if (!token) {
      return true;
    }
    const decodedToken = this.jwtService.decode(token);

    if (!decodedToken || !decodedToken.role) {
      throw new UnauthorizedException('Unauthorized');
    }
    if (decodedToken.role) {
      const jwtService = new JwtService();
      const decodedToken = jwtService.decode(token);
      const userId = decodedToken.id;
      request.userId = userId;

      return true;
    } else {
      throw new UnauthorizedException('Invalid Token Role');
    }
  }

  private extractTokenFromRequest(request: any): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.split(' ')[1];
  }
}
