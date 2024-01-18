/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { BlogModule } from './modules/blog/blog.modules';
@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.env',
  }),
  MongooseModule.forRootAsync({
    useFactory: async () => ({
      uri: 'mongodb://0.0.0.0:27017/wdp301',
    }),
  }),
    AuthModule,
    BlogModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
