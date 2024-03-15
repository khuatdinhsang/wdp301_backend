/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from './schemas/user.schemas';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuardUser } from './auth.guard';
import { Blog, BlogSchema } from '../blog/schemas/blog.schemas';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './google.strategy';
import { FacebookStrategy } from './facebook.strategy';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema },
        { name: Blog.name, schema: BlogSchema }]),
        JwtModule.register({
            global: true,
        }),
        PassportModule.register({
            defaultStrategy: 'social',
            session: false,
        }),
    ],
    controllers: [
        AuthController
    ],
    providers: [AuthService, AuthGuardUser, GoogleStrategy, FacebookStrategy],
    exports: [AuthService]
})
export class AuthModule { }
