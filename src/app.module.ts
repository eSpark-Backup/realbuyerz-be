/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './User/user.module';
import { PropertyModule } from './Property/property.module';

@Module({
  imports: [PrismaModule, UserModule,PropertyModule],
  controllers: [AppController],
  providers: [AppService,
  ],
})
export class AppModule {}
