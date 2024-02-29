import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Content } from "src/enums/content.enum";
import { Subject } from "src/enums/subject.enum";
import { User } from "src/modules/auth/schemas/user.schemas";
import { JwtDecode } from "src/modules/auth/types";
import ResponseHelper from "src/utils/respones.until";
import { CreateCommentDto, UpdateCommentDto } from "../dtos/comment.dto";
import { Comments } from "../schemas/comment.schema";

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
    async getAll(): Promise<Comments[]> {
        const allComment = await this.commentModel.find().lean().exec()
        return allComment as Comments[]
    }
    async getAllByFeedbackId(feedbackId: string ): Promise<Comments[]> {
        const allComment = await this.commentModel.find({ feedbackId }).lean().exec()
        return allComment as Comments[]
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
