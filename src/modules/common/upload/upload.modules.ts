/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuardUser } from 'src/modules/auth/auth.guard';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
    imports: [
        JwtModule.register({
            global: true,
        }),
    ],
    controllers: [
        UploadController
    ],
    providers: [UploadService, AuthGuardUser]
})
export class UploadModule { }
