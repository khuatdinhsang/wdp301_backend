/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { BlogModule } from './modules/blog/blog.modules';
import { UploadModule } from './modules/common/upload/upload.modules';
import { SmsModule } from './modules/common/sms/sms.modules';
import { FeedbackModule } from './modules/feedback/feedback.modules';
import { CommentModule } from './modules/comment/comment.module';
import { TransactionModule } from './modules/transaction/transaction.module';
// import { CorsModule } from '@nestjs/common';
import { AppGateway } from './app/app.gateway';
import { MessageModule } from './modules/message/message.module';
import { RoomModule } from './modules/room/room.module';
@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.env',
  }),
  MongooseModule.forRootAsync({
    useFactory: async () => ({
      uri: 'mongodb://0.0.0.0:27017/wdp301',
    }),
  }),
    // CorsModule.forRoot({
    //   origin: ['http://localhost:3000'],
    //   credentials: true,
    // }),
    AuthModule,
    BlogModule,
    UploadModule,
    SmsModule,
    FeedbackModule,
    CommentModule,
    TransactionModule,
    MessageModule,
    RoomModule
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule { }
