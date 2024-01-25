/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import twilio from 'twilio';

@Injectable()
export class SmsService {
    private twilioClient: twilio.Twilio;

    constructor() {
        this.twilioClient = twilio(
            process.env.TWILIO_ACCOUNT_SID,
            process.env.TWILIO_AUTH_TOKEN
        );
    }

    async sendSms(to: string, message: string): Promise<any> {
        try {
            const from = process.env.TWILIO_PHONE;

            const result = await this.twilioClient.messages.create({
                body: message,
                from: from,
                to: to,
            });

            console.log('SMS sent successfully:', result);
            return result;
        } catch (error) {
            console.error('Error sending SMS:', error);
            throw error;
        }
    }
}
