/* eslint-disable prettier/prettier */
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryRoom, HasTagRoom } from 'src/enums';
import { AuthGuardUser } from '../auth/auth.guard';
import { User } from '../auth/schemas/user.schemas';
import { JwtDecode } from '../auth/types';
import {
  createBlogDTO,
  detailBlogDTO,
  editBlogDTO,
  getAllDTO,
  preBlogDTO,
} from './dto';
import { Blog } from './schemas/blog.schemas';
import ResponseHelper from 'src/utils/respones.until';
import { Content } from 'src/enums/content.enum';
import { Subject } from 'src/enums/subject.enum';

@Injectable({})
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) { }
  async createBlog(data: createBlogDTO, currentUser: JwtDecode): Promise<Blog> {
    let hasTag = '';
    switch (data.category) {
      case CategoryRoom.RENT: {
        hasTag = HasTagRoom.RENT;
        break;
      }
      case CategoryRoom.FIND_ROOMMATES: {
        hasTag = HasTagRoom.FIND_ROOMMATES;
        break;
      }
      default:
        HasTagRoom.RENT;
    }
    const createdBlog = await this.blogModel.create({
      ...data,
      hasTag,
      userId: currentUser.id,
    });
    const user = await this.userModel.findById(currentUser.id);
    await this.userModel.findByIdAndUpdate(
      currentUser.id,
      { $set: { blogsPost: [...user.blogsPost, createdBlog.id] } },
      { new: true },
    );
    return createdBlog.toObject();
  }
  async detailBlog(id: string): Promise<Blog> {
    const blogDetail = await this.blogModel.findById(id);
    return blogDetail as Blog;
  }
  async getAllBlog(category: getAllDTO): Promise<Blog[]> {
    const allBlog = await this.blogModel
      .find({ category, isAccepted: true })
      .lean()
      .exec();
    return allBlog as Blog[];
  }
  async hiddenBlog(id: string): Promise<Blog> {
    const blog = await this.blogModel.findById(id);
    const blogHidden = await this.blogModel.findByIdAndUpdate(
      id,
      { $set: { isHide: blog.isHide ? false : true } },
      { new: true },
    );
    return blogHidden as Blog;
  }
  async editBlog(id: string, data: editBlogDTO): Promise<Blog> {
    const blog = await this.blogModel.findById(id);
    const blogModify = { ...blog.toObject(), ...data };
    const blogEdited = await this.blogModel.findByIdAndUpdate(id, blogModify, {
      new: true,
    });
    return blogEdited as Blog;
  }

  async getAllBlogAdmin(currentUser: JwtDecode) {
    const user = await this.userModel.findById(currentUser.id);
    if (!AuthGuardUser.isAdmin(user)) {
      return null;
    }
    const allBlog = await this.blogModel.find().lean().exec();
    return allBlog as Blog[];
  }

  async acceptBlog(
    id: string,
    currentUser: JwtDecode,
  ) {
    const user = await this.userModel.findById(currentUser.id);
    if (!AuthGuardUser.isAdmin(user)) {
      return ResponseHelper.response(
        HttpStatus.ACCEPTED,
        Subject.BLOG,
        Content.NOT_PERMISSION,
        null,
      );

    }
    const blogEdited = await this.blogModel.findByIdAndUpdate(id, { isAccepted: true }, {
      new: true,
    });
    return blogEdited;
  }

  async declineBlog(
    id: string,
    currentUser: JwtDecode,
  ) {
    const user = await this.userModel.findById(currentUser.id);
    if (!AuthGuardUser.isAdmin(user)) {
      
      return ResponseHelper.response(
        HttpStatus.ACCEPTED,
        Subject.BLOG,
        Content.NOT_PERMISSION,
        null,
      );

    }
    const blogEdited = await this.blogModel.findByIdAndUpdate(id, { isAccepted: false }, {
      new: true,
    });
    return blogEdited;
  }

  async blogRented(
    id: string,
    currentUser: JwtDecode,
  ) {
    const user = await this.userModel.findById(currentUser.id);

    if (!AuthGuardUser.isLessor(user) && !AuthGuardUser.isAdmin(user)) {
      return ResponseHelper.response(
        HttpStatus.ACCEPTED,
        Subject.BLOG,
        Content.NOT_PERMISSION,
        null,
      );

    }
    const blogEdited = await this.blogModel.findByIdAndUpdate(id, { isRented: true }, {
      new: true,
    });
    return blogEdited;
  }

  async blogUnrented(
    id: string,
    currentUser: JwtDecode,
  ) {
    const user = await this.userModel.findById(currentUser.id);

    if (!AuthGuardUser.isLessor(user) && !AuthGuardUser.isAdmin(user)) {
      return ResponseHelper.response(
        HttpStatus.ACCEPTED,
        Subject.BLOG,
        Content.NOT_PERMISSION,
        null,
      );

    }
    const blogEdited = await this.blogModel.findByIdAndUpdate(id, { isRented: false }, {
      new: true,
    });
    return blogEdited;
  }
}