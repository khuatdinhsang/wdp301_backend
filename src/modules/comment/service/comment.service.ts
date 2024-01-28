import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import { Content } from "src/enums/content.enum";
import { Subject } from "src/enums/subject.enum";
import { UploadService } from "src/modules/common/upload/upload.service";
import ResponseHelper from "src/utils/respones.until";
import { createCommentDto, detailCommentDTO, getAllCommentDTO, updateCommentDto } from "../dtos/comment.dto";
import { Comments } from "../schemas/comment.schema";

@Injectable({})
export class CommentService {
    constructor(
        @InjectModel(Comments.name) private CommentModel: Model<Comments>,
        private readonly uploadService: UploadService,
    ) { }
    async create(data: createCommentDto): Promise<Comments> {
        const fileName = await this.uploadService.uploadOneObject(data.file);
        const createdBlogRate = await this.CommentModel.create({ ...data, file: fileName })
        return createdBlogRate.toObject();
    }
    async getAll(data: getAllCommentDTO): Promise<Comments[]> {
        const allBlogRate = await this.CommentModel.find({data}).lean().exec()
        return allBlogRate as Comments[]
    }
    async update(id: detailCommentDTO, data: updateCommentDto) {
        const comment = await this.CommentModel.findById(id)
        if(!comment){
            return ResponseHelper.response(
                HttpStatus.ACCEPTED,
                Subject.FEEDBACK,
                Content.NOT_FOUND,
                null,
            );
        }
        else{
            const fileName = await this.uploadService.uploadOneObject(data.file);
            const commentModify = { ...comment.toObject(), ...data, file: fileName  }
            const commentEdited = await this.CommentModel.findByIdAndUpdate(id, commentModify, { new: true })
            return ResponseHelper.response(
                HttpStatus.OK,
                Subject.FEEDBACK,
                Content.SUCCESSFULLY,
                commentEdited,
            );
        }
    }
    async delete(id: detailCommentDTO){
        const comment = await this.CommentModel.findByIdAndDelete(id)
        if(!comment){
            return ResponseHelper.response(
                HttpStatus.ACCEPTED,
                Subject.FEEDBACK,
                Content.NOT_FOUND,
                null,
            );
        }
        else{
            return ResponseHelper.response(
                HttpStatus.OK,
                Subject.FEEDBACK,
                Content.SUCCESSFULLY,
                comment,
            )
        }
    }
}
