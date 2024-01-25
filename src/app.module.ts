/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
// app.module.ts

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthMiddleware } from './auth/jwt.auth-gaurd';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './User/user.module';
import { PropertyModule } from './Property/property.module';
import { UserPropertyModule } from './userProperty/userProperty.module';
import { UserAuthMiddleware } from './auth/jwt-user-auth-guard';
import { BiddingModule } from './bidding/bidding.module';

@Module({
  imports: [PrismaModule, UserModule, PropertyModule,UserPropertyModule, BiddingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('userrrr');
    // consumer.apply(UserAuthMiddleware).forRoutes('userProperty');
  }
}
