/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { User, UserSchema } from './schemas/user.schemas';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Blog, BlogSchema } from '../blog/schemas/blog.schemas';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema },
        { name: Blog.name, schema: BlogSchema }]),
        JwtModule.register({
            global: true,
        }),
    ],
    controllers: [
        AuthController
    ],
    providers: [AuthService, AuthGuard]
})
export class AuthModule { }
