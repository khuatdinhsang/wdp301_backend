/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SmsController } from './sms.controller';
import { SmsService } from './sms.service';

@Module({
    imports: [
        JwtModule.register({
            global: true,
        }),
    ],
    controllers: [
        SmsController
    ],
    providers: [SmsService]
})
export class SmsModule { }
