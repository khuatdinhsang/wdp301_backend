/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuardUser } from '../auth/auth.guard';
import { BlogRateController } from './controller/blog-rate.controller';
import { BlogRateSchema, Blog_Rate } from './schema/blog-rate.schemas';
import { BlogRateService } from './service/blog-rate.service';
import { BlogService } from '../blog/blog.service';
import { BlogModule } from '../blog/blog.modules';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Blog_Rate.name, schema: BlogRateSchema }]),
        JwtModule.register({
            global: true,
        }),
    ],
    controllers: [
        BlogRateController
    ],
    providers: [BlogRateService, AuthGuardUser],
})
export class FeedbackModule { }
