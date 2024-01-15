/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.env',
  }),
  MongooseModule.forRootAsync({
    useFactory: async () => ({
      uri: 'mongodb://0.0.0.0:27017/wdp301',
    }),
  }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
