import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Content } from "src/enums/content.enum";
import { Subject } from "src/enums/subject.enum";
import { JwtDecode } from "src/modules/auth/types";
import { Blog } from "src/modules/blog/schemas/blog.schemas";
import { UploadService } from "src/modules/common/upload/upload.service";
import ResponseHelper from "src/utils/respones.until";
import { createBlogRateDto, updateBlogRateDto } from "../dtos/blog-rate.dto";
import { Blog_Rate } from "../schema/blog-rate.schemas";
import { User } from "src/modules/auth/schemas/user.schemas";

@Injectable({})
export class BlogRateService {
    constructor(
        @InjectModel(Blog_Rate.name) private blogRateModel: Model<Blog_Rate>,
        @InjectModel(Blog.name) private blogModel: Model<Blog>,
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly uploadService: UploadService,
    ) { }
    async create( data: createBlogRateDto, currentUser: JwtDecode ): Promise<Blog_Rate> {
        const blogId = data.blogId;
        const user = await this.userModel.findById(currentUser.id);
        console.log(user);
        const createdBlogRate = await this.blogRateModel.create({...data, userId: currentUser.id, fullname: currentUser.fullName, avt: user.avatar, time: new Date()})
        const allBlogRate = await this.blogRateModel.find({ blogId }).lean().exec()
        const totalStars = allBlogRate.reduce((total, rate) => total + rate.star, 0);
        const avgBlogRate = totalStars / allBlogRate.length;
        await this.blogModel.findByIdAndUpdate(blogId, { avgBlogRate: avgBlogRate }).exec();
        return createdBlogRate.toObject();
    }
    async getAll(): Promise<Blog_Rate[]> {
        const allBlogRate = await this.blogRateModel.find().lean().exec()
        return allBlogRate as Blog_Rate[]
    }
    async getAllByBlogId(blogId: string ): Promise<Blog_Rate[]> {
        const allBlogRate = await this.blogRateModel.find({ blogId }).lean().exec()
        return allBlogRate as Blog_Rate[]
    }
    async CheckExistedBlog(blogId: string, currentUser: JwtDecode) {
        const userId = currentUser.id;
        const allBlogRate = await this.blogRateModel.findOne({ userId: userId, blogId: blogId }).lean().exec()
        if(allBlogRate){
            return true
        }
        else{
            return false
        }
    }
    async update(id: string, data: updateBlogRateDto) {
        const blogRate = await this.blogRateModel.findById(id)
        if(!blogRate){
            return ResponseHelper.response(
                HttpStatus.ACCEPTED,
                Subject.FEEDBACK,
                Content.NOT_FOUND,
                null,
            );
        }
        else{
            const blogRateModify = { ...blogRate.toObject(), ...data }
            const blogRateEdited = await this.blogRateModel.findByIdAndUpdate(id, blogRateModify, { new: true })
            
            const blogId = blogRate.blogId
            const allBlogRate = await this.blogRateModel.find({ blogId }).lean().exec()
            if(allBlogRate.length == 0){
                await this.blogModel.findByIdAndUpdate(blogId, { avgBlogRate: 0 }).exec();
            }
            else{
                const totalStars = allBlogRate.reduce((total, rate) => total + rate.star, 0);
                const avgBlogRate = totalStars / allBlogRate.length;
                await this.blogModel.findByIdAndUpdate(blogId, { avgBlogRate: avgBlogRate }).exec();
            }
            return ResponseHelper.response(
                HttpStatus.OK,
                Subject.FEEDBACK,
                Content.SUCCESSFULLY,
                blogRateEdited,
            );
        }
    }
    async delete(id: string){
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
            const blogId = blogRate.blogId
            const allBlogRate = await this.blogRateModel.find({ blogId }).lean().exec()
            if(allBlogRate.length == 0){
                await this.blogModel.findByIdAndUpdate(blogId, { avgBlogRate: 0 }).exec();
            }
            else{
                const totalStars = allBlogRate.reduce((total, rate) => total + rate.star, 0);
                const avgBlogRate = totalStars / allBlogRate.length;
                await this.blogModel.findByIdAndUpdate(blogId, { avgBlogRate: avgBlogRate }).exec();
            }
            return ResponseHelper.response(
                HttpStatus.OK,
                Subject.FEEDBACK,
                Content.SUCCESSFULLY,
                blogRate,
            )
        }
    }

}
