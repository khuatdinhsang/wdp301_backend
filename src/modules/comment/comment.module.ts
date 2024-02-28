/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthGuardUser } from '../auth/auth.guard';
import { CommentController } from './controller/comment.controller';
import { Comments, CommentsSchema } from './schemas/comment.schema';
import { CommentService } from './service/comment.service';
import { User, UserSchema } from '../auth/schemas/user.schemas';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Comments.name, schema: CommentsSchema }, { name: User.name, schema: UserSchema }]),
        JwtModule.register({
            global: true,
        }),
    ],
    controllers: [
        CommentController
    ],
    providers: [CommentService, AuthGuardUser],
})
export class CommentModule { }
