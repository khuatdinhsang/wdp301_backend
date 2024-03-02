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

@Injectable({})
export class CommentService {
    constructor(
        @InjectModel(Comments.name) private CommentModel: Model<Comments>,
        private readonly uploadService: UploadService,
    ) { }
    async create(data: CreateCommentDto): Promise<Comments> {
        const fileName = await this.uploadService.uploadOneObject(data.file);
        const createdBlogRate = await this.CommentModel.create({ ...data, file: fileName })
        return createdBlogRate.toObject();
    }
    // async getAll(data: getAllCommentDTO): Promise<Comments[]> {
    //     const allBlogRate = await this.CommentModel.find({ data }).lean().exec()
    //     return allBlogRate as Comments[]
    // }

    async getAllByFeedbackId(feedbackId: string, limit: number = LIMIT_DOCUMENT, page: number = 1): Promise<any> {
        const skipNumber = (page - 1) * limit;
        const totalComment = await this.CommentModel.countDocuments({ feedbackId })
        const allComment = await this.CommentModel
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
        const comment = await this.CommentModel.findById(id)
        if (!comment) {
            return ResponseHelper.response(
                HttpStatus.ACCEPTED,
                Subject.FEEDBACK,
                Content.NOT_FOUND,
                null,
            );
        }
        else {
            const fileName = await this.uploadService.uploadOneObject(data.file);
            const commentModify = { ...comment.toObject(), ...data, file: fileName }
            const commentEdited = await this.CommentModel.findByIdAndUpdate(id, commentModify, { new: true })
            return ResponseHelper.response(
                HttpStatus.OK,
                Subject.FEEDBACK,
                Content.SUCCESSFULLY,
                commentEdited,
            );
        }
    }
    async delete(id: string) {
        const comment = await this.CommentModel.findByIdAndDelete(id)
        if (!comment) {
            return ResponseHelper.response(
                HttpStatus.ACCEPTED,
                Subject.FEEDBACK,
                Content.NOT_FOUND,
                null,
            );
        }
        else {
            return ResponseHelper.response(
                HttpStatus.OK,
                Subject.FEEDBACK,
                Content.SUCCESSFULLY,
                comment,
            )
        }
    }
}


