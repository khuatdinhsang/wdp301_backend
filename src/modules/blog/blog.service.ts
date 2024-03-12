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
  editBlogDTO,
  getAllDTO,
  searchBlogDTO,
} from './dto';
import { Blog } from './schemas/blog.schemas';
import ResponseHelper from 'src/utils/respones.until';
import { Content } from 'src/enums/content.enum';
import { Subject } from 'src/enums/subject.enum';
import { LIMIT_DOCUMENT } from '../../contants'
import { Field } from 'src/enums/field.enum';
import { Transaction } from '../transaction/schemas/transaction.schemas';
@Injectable({})
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private blogModel: Model<Blog>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,

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
  async getAllBlogAccepted(category: getAllDTO, limit: number = LIMIT_DOCUMENT, page: number = 1): Promise<any> {
    const skipNumber = (page - 1) * limit;
    const totalBlog = await this.blogModel.countDocuments({ category, isAccepted: true, 'isHide.hidden': false })
    const allBlog = await this.blogModel
      .find({ category, isAccepted: true, 'isHide.hidden': false })
      .skip(skipNumber)
      .limit(limit)
    const response = {
      totalBlog: totalBlog,
      allBlog: allBlog,
      currentPage: (page),
      limit: (limit)
    }
    return response
  }
  async hiddenBlog(id: string): Promise<any> {
    try {
      const blog = await this.blogModel.findById(id);
      const timestamp = new Date(blog.expiredTime).getTime(); // Chia cho 1000 để chuyển từ milliseconds sang seconds
      if (Date.now() === timestamp) {
        blog.isHide = {
          hidden: true,
          content: 'Hết thời gian của bài đăng',
          day: new Date()
        }
      }
      await blog.save()
    } catch (err) {
      console.log("err", err)
    }
  }
  async editBlog(id: string, data: editBlogDTO): Promise<Blog> {
    const blog = await this.blogModel.findById(id);
    const blogModify = { ...blog.toObject(), ...data };
    const blogEdited = await this.blogModel.findByIdAndUpdate(id, blogModify, {
      new: true,
    });
    return blogEdited as Blog;
  }

  async getAllBlogAdmin(currentUser: JwtDecode, limit: number = LIMIT_DOCUMENT, page: number = 1, search: string): Promise<any> {
    const user = await this.userModel.findById(currentUser.id);
    if (!AuthGuardUser.isAdmin(user)) {
      return null;
    }
    const skipNumber = (page - 1) * limit;
    const conditions = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ],
    };
    const searchQuery = search ? conditions : null;
    const totalBlog = await this.blogModel.countDocuments(searchQuery)
    const allBlog = await this.blogModel
      .find(searchQuery)
      .skip(skipNumber)
      .limit(limit)
    const response = {
      totalBlog: totalBlog,
      allBlog: allBlog,
      currentPage: (page),
      limit: (limit)
    }
    return response
  }

  async getAllAcceptBlogAdmin(limit: number = LIMIT_DOCUMENT, page: number = 1): Promise<any> {
    const skipNumber = (page - 1) * limit;
    const allBlog = await this.blogModel
      .find({ isAccepted: true })
      .skip(skipNumber)
      .limit(limit)
    const totalBlog = await this.blogModel.countDocuments({ isAccepted: true })
    const response = {
      totalBlog: totalBlog,
      allBlog: allBlog,
      currentPage: (page),
      limit: (limit)
    }
    return response
  }

  async getAllUnacceptBlogAdmin(currentUser: JwtDecode, limit: number = LIMIT_DOCUMENT, page: number = 1): Promise<any> {
    const user = await this.userModel.findById(currentUser.id);
    if (!AuthGuardUser.isAdmin(user)) {
      return null;
    }
    const skipNumber = (page - 1) * limit;
    const totalBlog = await this.blogModel.countDocuments({ isAccepted: false })
    const allBlog = await this.blogModel
      .find({ isAccepted: false })
      .skip(skipNumber)
      .limit(limit)
    const response = {
      totalBlog: totalBlog,
      allBlog: allBlog,
      currentPage: (page),
      limit: (limit)
    }
    return response
  }

  async getAllRentedBlogAdmin(currentUser: JwtDecode, limit: number = LIMIT_DOCUMENT, page: number = 1): Promise<any> {
    const user = await this.userModel.findById(currentUser.id);
    if (!AuthGuardUser.isAdmin(user)) {
      return null;
    }
    const skipNumber = (page - 1) * limit;
    const totalBlog = await this.blogModel.countDocuments({ isRented: true })
    const allBlog = await this.blogModel
      .find({ isRented: true })
      .skip(skipNumber)
      .limit(limit)
    const response = {
      totalBlog: totalBlog,
      allBlog: allBlog,
      currentPage: (page),
      limit: (limit)
    }
    return response
  }

  async getAllUnRentedBlogAdmin(currentUser: JwtDecode, limit: number = LIMIT_DOCUMENT, page: number = 1): Promise<any> {
    const user = await this.userModel.findById(currentUser.id);
    if (!AuthGuardUser.isAdmin(user)) {
      return null;
    }
    const skipNumber = (page - 1) * limit;
    const totalBlog = await this.blogModel.countDocuments({ isRented: false })
    const allBlog = await this.blogModel
      .find({ isRented: false })
      .skip(skipNumber)
      .limit(limit)
    const response = {
      totalBlog: totalBlog,
      allBlog: allBlog,
      currentPage: (page),
      limit: (limit)
    }
    return response
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
    const timestamp = new Date(blogEdited.expiredTime).getTime();
    const timeDifference = timestamp - Date.now();
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    const transaction = await this.transactionModel.create({
      userId: currentUser.id,
      blogId: id,
      totalMoney: Math.ceil(daysDifference) * 3000
    })
    console.log("da", transaction)
    return blogEdited;
  }

  async declineBlog(
    id: string,
    currentUser: JwtDecode,
    hiddenReason: string
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
    const blog = await this.blogModel.findByIdAndUpdate(id, { isAccepted: false }, {
      new: true,
    });
    blog.isHide = {
      hidden: true,
      content: hiddenReason,
      day: new Date(),
    };
    await blog.save()
    return blog

  }

  async blogRented(
    id: string,
    currentUser: JwtDecode,
  ) {
    const user = await this.userModel.findById(currentUser.id);

    if (!AuthGuardUser.isLessor(user)) {
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

  // người cho thuê xác nhận cho thuê
  async ConfirmUserRentRoom(
    blogId: string,
    renterId: string,
    currentUser: JwtDecode,
  ) {
    const user = await this.userModel.findById(currentUser.id);
    const blog = await this.blogModel.findById(blogId);
    if (!AuthGuardUser.isLessor(user) && !AuthGuardUser.isRenter(user)) {
      return ResponseHelper.response(
        HttpStatus.ACCEPTED,
        Subject.BLOG,
        Content.NOT_PERMISSION,
        null,
      );

    }
    if (blog.isRented) {
      return ResponseHelper.response(
        HttpStatus.ACCEPTED,
        Subject.BLOG,
        Content.RENTED,
        null,
      );
    }
    const blogRented = await this.blogModel.findByIdAndUpdate(blogId,
      {
        $addToSet: { Renterid: renterId },
        $pull: { Renterconfirm: renterId },
        isRented: true
      },
      { new: true });
    return blogRented;
  }

  // người cho thuê không xác nhận cho thuê
  async LessorCancalUserRentRoom(
    blogId: string,
    renterId: string,
    currentUser: JwtDecode,
  ) {
    const user = await this.userModel.findById(currentUser.id);
    if (!AuthGuardUser.isLessor(user) && !AuthGuardUser.isRenter(user)) {
      return ResponseHelper.response(
        HttpStatus.ACCEPTED,
        Subject.BLOG,
        Content.NOT_PERMISSION,
        null,
      );

    }
    const blogRented = await this.blogModel.findByIdAndUpdate(blogId,
      {
        $pull: { Renterconfirm: renterId },
      },
      { new: true });
    return blogRented;
  }

  // người bỏ thuê phòng đang chờ confirm
  async RenterUnRentRoom(
    blogId: string,
    currentUser: JwtDecode,
  ) {
    const user = await this.userModel.findById(currentUser.id);
    if (!AuthGuardUser.isRenter(user)) {
      return ResponseHelper.response(
        HttpStatus.ACCEPTED,
        Subject.BLOG,
        Content.NOT_PERMISSION,
        null,
      );

    }
    const blogRented = await this.blogModel.findByIdAndUpdate(blogId,
      {
        $pull: { Renterconfirm: currentUser.id },
      },
      { new: true });
    return blogRented;
  }

  //  người thuê nhấn thuê 
  async UserRentRoom(
    id: string,
    currentUser: JwtDecode,
  ) {
    const user = await this.userModel.findById(currentUser.id);
    const blog = await this.blogModel.findById(id);
    if (!AuthGuardUser.isRenter(user)) {
      return ResponseHelper.response(
        HttpStatus.ACCEPTED,
        Subject.BLOG,
        Content.NOT_PERMISSION,
        null,
      );

    }
    if (blog.isRented) {
      return ResponseHelper.response(
        HttpStatus.ACCEPTED,
        Subject.BLOG,
        Content.RENTED,
        null,
      );
    }
    const blogRented = await this.blogModel.findByIdAndUpdate(id, {
      $addToSet: { Renterconfirm: currentUser.id },
    }, {
      new: true,
    });
    return blogRented;
  }


  async searchBlog(param: getAllDTO, body: searchBlogDTO, limit: number = LIMIT_DOCUMENT, page: number = 1, search: string): Promise<any> {
    const skipNumber = (page - 1) * limit;
    const conditions = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
      ],
      $and: [
        {
          money: { $gte: body.minPrice, $lte: body.maxPrice },
          area: { $gte: body.minArea, $lte: body.maxArea },
          isAccepted: true,
          isHide: {
            hidden: false
          },
          category: param
        }
      ]
    };
    const searchQuery = search ? conditions : {
      money: { $gte: body.minPrice, $lte: body.maxPrice },
      area: { $gte: body.minArea, $lte: body.maxArea },
      isAccepted: true,
      isHide: {
        hidden: false
      },
      category: param
    };
    const totalBlog = await this.blogModel.countDocuments(searchQuery)
    const allBlog = await this.blogModel
      .find(searchQuery)
      .skip(skipNumber)
      .limit(limit)
    const response = {
      totalBlog: totalBlog,
      allBlog: allBlog,
      currentPage: (page),
      limit: (limit)
    }
    return response
  }

  // lấy ra phòng người dùng thuê
  async GetRoonRentedByUser(
    currentUser: JwtDecode,
  ) {
    const user = await this.userModel.findById(currentUser.id);
    if (!AuthGuardUser.isRenter(user)) {
      return ResponseHelper.response(
        HttpStatus.ACCEPTED,
        Subject.BLOG,
        Content.NOT_PERMISSION,
        null,
      );
    }
    const blogRented = await this.blogModel.find({ Renterid: currentUser.id });
    return ResponseHelper.response(
      HttpStatus.OK,
      Subject.BLOG,
      Content.SUCCESSFULLY,
      blogRented,
      Field.READ
    )
  }

  // lấy ra phòng người dùng chờ xác nhận thuê
  async GetRoomWaitingConfirmByUser(
    currentUser: JwtDecode,
  ) {
    const user = await this.userModel.findById(currentUser.id);
    if (!AuthGuardUser.isRenter(user)) {
      return ResponseHelper.response(
        HttpStatus.ACCEPTED,
        Subject.BLOG,
        Content.NOT_PERMISSION,
        null,
      );
    }
    const blogRented = await this.blogModel.find({ Renterconfirm: currentUser.id });
    return ResponseHelper.response(
      HttpStatus.OK,
      Subject.BLOG,
      Content.SUCCESSFULLY,
      blogRented,
      Field.READ
    )
  }

  // lấy ra phòng người cho thuê đăng 
  async GetRoomLessorRentOut(
    currentUser: JwtDecode,
  ) {
    const user = await this.userModel.findById(currentUser.id)
      .populate('blogsPost')
      .exec();;
    if (!AuthGuardUser.isLessor(user)) {
      return ResponseHelper.response(
        HttpStatus.ACCEPTED,
        Subject.BLOG,
        Content.NOT_PERMISSION,
        null,
      );
    }
    return ResponseHelper.response(
      HttpStatus.OK,
      Subject.BLOG,
      Content.SUCCESSFULLY,
      user.blogsPost,
      Field.READ
    )
  }

  async GetRentedRoomLessorRentOut(
    currentUser: JwtDecode,
  ) {
    const user = await this.userModel.findById(currentUser.id)
      .populate({
        path: 'blogsPost',
        match: { isRented: true },
        populate: [
          {
            path: 'Renterid',
            model: 'User',
          },
          {
            path: 'Renterconfirm',
            model: 'User',
          },
        ],
      })
      .exec();;
    if (!AuthGuardUser.isLessor(user)) {
      return ResponseHelper.response(
        HttpStatus.ACCEPTED,
        Subject.BLOG,
        Content.NOT_PERMISSION,
        null,
      );
    }
    return ResponseHelper.response(
      HttpStatus.OK,
      Subject.BLOG,
      Content.SUCCESSFULLY,
      user.blogsPost,
      Field.READ
    )
  }

  async GetUnrentedRoomLessorRentOut(
    currentUser: JwtDecode,
  ) {
    const user = await this.userModel.findById(currentUser.id)
      .populate({
        path: 'blogsPost',
        match: { isRented: false },
        populate: [
          {
            path: 'Renterid',
            model: 'User',
          },
          {
            path: 'Renterconfirm',
            model: 'User',
          },
        ],

      })
      .exec();;
    if (!AuthGuardUser.isLessor(user)) {
      return ResponseHelper.response(
        HttpStatus.ACCEPTED,
        Subject.BLOG,
        Content.NOT_PERMISSION,
        null,
      );
    }
    return ResponseHelper.response(
      HttpStatus.OK,
      Subject.BLOG,
      Content.SUCCESSFULLY,
      user.blogsPost,
      Field.READ
    )
  }

  async getRoomate(blogId: string, currentUser: JwtDecode) {
    try {
      const blog = await this.blogModel.findById(blogId);

      if (!blog) {
        return ResponseHelper.response(
          HttpStatus.NOT_FOUND,
          Subject.BLOG,
          Content.NOT_FOUND,
          null,
          Field.READ
        );
      }

      const roomateId = blog.Renterid.filter(id => id !== currentUser.id.toString());

      const roomate = await this.userModel.find({ _id: { $in: roomateId } });

      return ResponseHelper.response(
        HttpStatus.OK,
        Subject.BLOG,
        Content.SUCCESSFULLY,
        roomate,
        Field.READ
      );
    } catch (error) {
      return ResponseHelper.response(
        HttpStatus.INTERNAL_SERVER_ERROR,
        Subject.BLOG,
        Content.FAILED,
        error.message,
        Field.READ
      );
    }
  }

  async getFilteredBlogs(blogId: string) {
    const currentBlog = await this.blogModel.findById(blogId);

    if (!currentBlog) {
      return ResponseHelper.response(
        HttpStatus.ACCEPTED,
        Subject.BLOG,
        Content.NOT_FOUND,
        null,
      );;
    }

    const query = {
      _id: { $ne: blogId },
      area: { $gt: currentBlog.area - 5, $lt: currentBlog.area + 5 },
      money: { $gt: currentBlog.money - 500000, $lt: currentBlog.money + 500000 },
    };

    return this.blogModel.find(query).exec();
  }

  async getWeeklyPostCount(currentUser: JwtDecode,) {

    const user = await this.userModel.findById(currentUser.id);
    if (!AuthGuardUser.isAdmin(user)) {
      return ResponseHelper.response(
        HttpStatus.ACCEPTED,
        Subject.BLOG,
        Content.NOT_PERMISSION,
        null,
      );

    }

    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const count = await this.blogModel.countDocuments({
      createdAt: { $gte: startOfWeek, $lt: endOfWeek },
    });

    return count;
  }

}