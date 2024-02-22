import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { Content } from "src/enums/content.enum";
import { Subject } from "src/enums/subject.enum";
import { JwtDecode } from "src/modules/auth/types";
import ResponseHelper from "src/utils/respones.until";
import { createBlogRateDto, detailBlogRateDTO, updateBlogRateDto } from "../dtos/blog-rate.dto";
import { Blog_Rate } from "../schema/blog-rate.schemas";
import { UploadService } from "src/modules/common/upload/upload.service";

@Injectable({})
export class BlogRateService {
    constructor(
        @InjectModel(Blog_Rate.name) private blogRateModel: Model<Blog_Rate>,
        private readonly uploadService: UploadService,
    ) { }
    async create( data: createBlogRateDto, currentUser: JwtDecode ): Promise<Blog_Rate> {
        const fileName = await this.uploadService.uploadMultipleObjects(data.file);
        const createdBlogRate = await this.blogRateModel.create({...data, file: fileName, userId: currentUser.id, fullname: currentUser.fullName, time: new Date()})
        return createdBlogRate.toObject();
    }
    async getAll(): Promise<Blog_Rate[]> {
        const allBlogRate = await this.blogRateModel.find().lean().exec()
        return allBlogRate as Blog_Rate[]
    }
    async update(id: string, data: updateBlogRateDto) {
        const blogRate = await this.blogRateModel.findById(id)
        if(!blogRate){
            return ResponseHelper.response(
                HttpStatus.ACCEPTED,
                Subject.BLOG,
                Content.NOT_FOUND,
                null,
            );
        }
        else{
            const blogRateModify = { ...blogRate.toObject(), ...data }
            const blogRateEdited = await this.blogRateModel.findByIdAndUpdate(id, blogRateModify, { new: true })
            return ResponseHelper.response(
                HttpStatus.OK,
                Subject.FEEDBACK,
                Content.SUCCESSFULLY,
                blogRateEdited,
            );
        }
    }
    async delete(id: detailBlogRateDTO){
        const blogRate = await this.blogRateModel.findByIdAndDelete(id)
        if(!blogRate){
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
                blogRate,
            )
        }
    }
}
