/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserAuthMiddleware implements NestMiddleware {

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'Authentication token missing' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);
      if(decoded.role == 'user'){
      req['user'] = decoded;
      next();
      }

      else{
        return res.status(401).json({ message: 'Authentication failed' });
      }
    } catch (err) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
  }
}
