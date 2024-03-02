/* eslint-disable prettier/prettier */
import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Content } from "src/enums/content.enum";
import { Subject } from "src/enums/subject.enum";
import { UploadService } from "src/modules/common/upload/upload.service";
import ResponseHelper from "src/utils/respones.until";
import { CreateCommentDto, UpdateCommentDto } from "../dtos/comment.dto";
import { Comments } from "../schemas/comment.schema";
import { LIMIT_DOCUMENT } from "src/contants";
import { User } from "src/modules/auth/schemas/user.schemas";
import { JwtDecode } from "src/modules/auth/types/jwt.type";

@Injectable({})
export class CommentService {
    constructor(
        @InjectModel(Comments.name) private commentModel: Model<Comments>,
        @InjectModel(User.name) private userModel: Model<User>,
    ) { }
    async create( data: CreateCommentDto, currentUser: JwtDecode ): Promise<Comments> {
        const user = await this.userModel.findById(currentUser.id);
        const createdComment = await this.commentModel.create({...data, userId: currentUser.id, fullname: currentUser.fullName, avt: user.avatar, time: new Date()})
        return createdComment.toObject();
    }
    // async getAll(data: getAllCommentDTO): Promise<Comments[]> {
    //     const allBlogRate = await this.CommentModel.find({ data }).lean().exec()
    //     return allBlogRate as Comments[]
    // }

    async getAllByFeedbackId(feedbackId: string, limit: number = LIMIT_DOCUMENT, page: number = 1): Promise<any> {
        const skipNumber = (page - 1) * limit;
        const totalComment = await this.commentModel.countDocuments({ feedbackId })
        const allComment = await this.commentModel
            .find({ feedbackId })
            .skip(skipNumber)
            .limit(limit)
        const response = {
            totalComment,
            allComment,
            currentPage: (page),
            limit: (limit)
        }
        return response
    }
    async update(id: string, data: UpdateCommentDto) {
        const comment = await this.commentModel.findById(id)
        if(!comment){
            return ResponseHelper.response(
                HttpStatus.ACCEPTED,
                Subject.COMMENT,
                Content.NOT_FOUND,
                null,
            );
        }
        else{
            const commentModify = { ...comment.toObject(), ...data }
            const commentEdited = await this.commentModel.findByIdAndUpdate(id, commentModify, { new: true })
            return ResponseHelper.response(
                HttpStatus.OK,
                Subject.COMMENT,
                Content.SUCCESSFULLY,
                commentEdited,
            );
        }
    }
    async delete(id: string){
        const comment = await this.commentModel.findByIdAndDelete(id)
        if(!comment){
            return ResponseHelper.response(
                HttpStatus.ACCEPTED,
                Subject.COMMENT,
                Content.NOT_FOUND,
                null,
            );
        }
        else{
            return ResponseHelper.response(
                HttpStatus.OK,
                Subject.COMMENT,
                Content.SUCCESSFULLY,
                comment,
            )
        }
    }
}


