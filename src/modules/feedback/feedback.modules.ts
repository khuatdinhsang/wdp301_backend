/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuardUser } from '../auth/auth.guard';
import { User, UserSchema } from '../auth/schemas/user.schemas';
import { Blog, BlogSchema } from '../blog/schemas/blog.schemas';
import { UploadModule } from '../common/upload/upload.modules';
import { UploadService } from '../common/upload/upload.service';
import { BlogRateController } from './controller/blog-rate.controller';
import { BlogRateSchema, Blog_Rate } from './schema/blog-rate.schemas';
import { BlogRateService } from './service/blog-rate.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Blog_Rate.name, schema: BlogRateSchema }, { name: Blog.name, schema: BlogSchema }, { name: User.name, schema: UserSchema }]),
        UploadModule,
        JwtModule.register({
            global: true,
        }),
    ],
    controllers: [
        BlogRateController
    ],
    providers: [BlogRateService, AuthGuardUser, UploadService],
})
export class FeedbackModule { }
