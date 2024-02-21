/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuardUser } from '../auth/auth.guard';
import { commentController } from './controller/comment.controller';
import { Comments, commentsSchema } from './schemas/comment.schema';
import { CommentService } from './service/comment.service';
import { UploadService } from '../common/upload/upload.service';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Comments.name, schema: commentsSchema }]),
        JwtModule.register({
            global: true,
        }),
    ],
    controllers: [
        commentController
    ],
    providers: [CommentService, UploadService, AuthGuardUser],
})
export class CommentModule { }
