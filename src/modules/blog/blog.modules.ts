/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { Blog, BlogSchema } from './schemas/blog.schemas';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { AuthGuard } from '../auth/auth.guard';
import { User, UserSchema } from '../auth/schemas/user.schemas';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }, { name: User.name, schema: UserSchema },]),
        JwtModule.register({
            global: true,
        }),
    ],
    controllers: [
        BlogController
    ],
    providers: [BlogService, AuthGuard]
})
export class BlogModule { }
