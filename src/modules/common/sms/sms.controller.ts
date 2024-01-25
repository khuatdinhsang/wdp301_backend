/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { SmsService } from './sms.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Sms')
@Controller('sms')
export class SmsController {
    constructor(private readonly smsService: SmsService) { }

    @Post('send')
    async sendSms(@Body() body: { to: string; message: string }): Promise<any> {
        const { to, message } = body;
        return this.smsService.sendSms(to, message);
    }
}