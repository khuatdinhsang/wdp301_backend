/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuardUser } from '../auth/auth.guard';
import { Message, MessageSchema } from './schemas/message.schemas';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
        JwtModule.register({
            global: true,
        }),
    ],
    controllers: [
        MessageController
    ],
    providers: [MessageService, AuthGuardUser],
    exports: [MessageService]
})
export class MessageModule { }
