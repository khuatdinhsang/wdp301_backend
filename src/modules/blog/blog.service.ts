/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from './schemas/blog.schemas';
import { createBlogDTO, detailBlogDTO, editBlogDTO, getAllDTO } from './dto';
import { JwtDecode } from '../auth/types';
import { User } from '../auth/schemas/user.schemas';
import { CategoryRoom, HasTagRoom } from 'src/enums';

@Injectable({})
export class BlogService {
    constructor(
        @InjectModel(Blog.name) private blogModel: Model<Blog>,
        @InjectModel(User.name) private userModel: Model<User>,
    ) { }
    async createBlog(data: createBlogDTO, currentUser: JwtDecode): Promise<Blog> {
        let hasTag = ''
        switch (data.category) {
            case CategoryRoom.RENT: {
                hasTag = HasTagRoom.RENT
                break;
            }
            case CategoryRoom.FIND_ROOMMATES: {
                hasTag = HasTagRoom.FIND_ROOMMATES
                break
            }
            default: HasTagRoom.RENT

        }
        const createdBlog = await this.blogModel.create({ ...data, hasTag, userId: currentUser.id })
        const user = await this.userModel.findById(currentUser.id)
        await this.userModel.findByIdAndUpdate(currentUser.id, { $set: { blogsPost: [...user.blogsPost, createdBlog.id] } }, { new: true })
        return createdBlog.toObject();
    }
    async detailBlog(id: detailBlogDTO): Promise<Blog> {
        const blogDetail = await this.blogModel.findById(id)
        return blogDetail as Blog;
    }
    async getAllBlog(category: getAllDTO): Promise<Blog[]> {
        const allBlog = await this.blogModel.find({ category }).lean().exec()
        return allBlog as Blog[]
    }
    async hiddenBlog(id: detailBlogDTO): Promise<Blog> {
        const blog = await this.blogModel.findById(id)
        const blogHidden = await this.blogModel.findByIdAndUpdate(id, { $set: { isHide: blog.isHide ? false : true } }, { new: true })
        return blogHidden as Blog
    }
    async editBlog(id: detailBlogDTO, data: editBlogDTO): Promise<Blog> {
        const blog = await this.blogModel.findById(id)
        const blogModify = { ...blog.toObject(), ...data }
        const blogEdited = await this.blogModel.findByIdAndUpdate(id, blogModify, { new: true })
        return blogEdited as Blog
    }
}
