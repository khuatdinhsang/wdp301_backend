import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { Content } from "src/enums/content.enum";
import { Subject } from "src/enums/subject.enum";
import { JwtDecode } from "src/modules/auth/types";
import ResponseHelper from "src/utils/respones.until";
import { createBlogRateDto, detailBlogRateDTO, updateBlogRateDto } from "../dtos/blog-rate.dto";
import { Blog_Rate } from "../schema/blog-rate.schemas";
import { Blog } from "src/modules/blog/schemas/blog.schemas";

@Injectable({})
export class BlogRateService {
    constructor(
        @InjectModel(Blog_Rate.name) private blogRateModel: Model<Blog_Rate>,
    ) { }
    async create( data: createBlogRateDto, currentUser: JwtDecode ): Promise<Blog_Rate> {
        console.log(data.blogId);
        
        const createdBlogRate = await this.blogRateModel.create({ ...data, userId: currentUser.id})
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
