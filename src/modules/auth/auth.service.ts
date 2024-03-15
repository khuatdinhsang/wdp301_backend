/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from './schemas/user.schemas';
import * as bcrypt from 'bcrypt';
import { HttpEnum, JwtEnum, UserMessage, UserRole } from 'src/enums';
import { LoginDTO, dataTypeLogin, editProfileDTO, ChangePasswordDTO, refreshTokenDTO, registerDTO, ResponseChangePassword } from './dto';
import { JwtDecode, JwtPayload, Tokens } from './types';
import { Jwt } from 'src/common/jwt';
import { Blog } from '../blog/schemas/blog.schemas';
import ResponseHelper from 'src/utils/respones.until';
import { Subject } from 'src/enums/subject.enum';
import { Content } from 'src/enums/content.enum';
import { LIMIT_DOCUMENT } from 'src/contants';
import { AuthGuardUser } from './auth.guard';
import { Blog_Rate } from '../feedback/schema/blog-rate.schemas';
@Injectable({})
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Blog.name) private blogModel: Model<Blog>,
        @InjectModel(Blog_Rate.name) private blogRateModel: Model<Blog_Rate>,
        private jwtService: JwtService,

    ) { }
    async register(data: registerDTO): Promise<User> {
        const { fullName, phone, password, confirmPassword, role } = data
        const checkUserExist = await this.userModel.findOne({ phone: phone })
        if (checkUserExist) {
            throw new Error(
                UserMessage.phoneExist
            )
        }
        if (password !== confirmPassword) {
            throw new Error(
                UserMessage.passwordNotMatch
            )
        }
        if (role === UserRole.ADMIN) {
            throw new Error(
                UserMessage.roleInValid
            )
        }
        const hash = bcrypt.hashSync(password, 10);
        const createdUser = await this.userModel.create({ fullName, phone, password: hash, role: role })
        const userObject = createdUser.toObject();
        const userModify = { ...userObject, password: "******" };
        return userModify;
    }
    async login(data: LoginDTO): Promise<dataTypeLogin> {
        const { phone, password } = data
        const userExist = await this.userModel.findOne({ phone })
        if (!userExist) {
            throw new Error(
                UserMessage.phoneNotExist
            )
        }
        if (userExist.block.isBlock) {
            throw new Error(
                UserMessage.blockAccount
            )
        }
        const comparePassword = bcrypt.compareSync(password, userExist.password)
        if (!comparePassword) {
            throw new Error(
                UserMessage.passwordInValid
            )
        }
        const payload = { id: userExist._id.toString(), fullName: userExist.fullName, role: userExist.role };
        const tokens = await this.getTokens(payload)
        await this.userModel.findByIdAndUpdate(userExist._id, { $set: { refreshToken: tokens.refreshToken } }, { new: true })
        return tokens
    }
    async handleVerifyToken(token: string) {
        try {
            const payload = this.jwtService.verify(token); // this.configService.get('SECRETKEY')
            return payload
        } catch (e) {
            throw new HttpException(
                {
                    key: '',
                    data: {},
                    statusCode: HttpStatus.UNAUTHORIZED,
                },
                HttpStatus.UNAUTHORIZED,
            );
        }
    }
    async refreshToken(data: refreshTokenDTO): Promise<Tokens> {
        const payload = Jwt.getPayloadToken(data.refreshToken);
        const user = await this.userModel.findById(payload.id)
        if (!user) throw Error(HttpEnum.internalServerError);

        if (user.refreshToken !== data.refreshToken)
            throw new Error(UserMessage.refreshTokenUnauthorized);
        const tokens = await this.getTokens({
            id: user.id,
            fullName: user.fullName,
            role: user.role
        });
        await this.userModel.findByIdAndUpdate(user._id, { $set: { refreshToken: tokens.refreshToken } }, { new: true })
        return tokens
    }


    async favoriteBlog(data: { blogId: string }, currentUser: JwtDecode) {
        // Tìm người dùng hiện tại
        const user = await this.userModel.findById(currentUser.id);
        if (!user) {
            throw new Error(UserMessage.userNotFound);
        }
        const blog = await this.blogModel.findById(data.blogId);
        if (!blog) {
            throw new Error(UserMessage.blogNotFound);
        }
        const blogId = new mongoose.Types.ObjectId(data.blogId);
        const isFavorite = user.blogsFavorite.some(favoriteBlogId => favoriteBlogId.toString() === blogId.toString());
        if (isFavorite) {
            user.blogsFavorite = user.blogsFavorite.filter(blogId => blogId.toString() !== data.blogId);
            blog.totalFavorite -= 1;
            await blog.save();
        } else {
            user.blogsFavorite.push(blog);
            blog.totalFavorite += 1;
            await blog.save();
        }
        await user.save();
        if (isFavorite) {
            return ResponseHelper.response(
                HttpStatus.OK,
                Subject.UNFAVORITEBLOG,
                Content.SUCCESSFULLY,
                user,
            );
        } else {
            return ResponseHelper.response(
                HttpStatus.OK,
                Subject.FAVORITEBLOG,
                Content.SUCCESSFULLY,
                user,
            );
        }
    }


    async getTokens(payload: JwtPayload): Promise<Tokens> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_ACCESS_KEY,
                expiresIn: JwtEnum.expiresAccessToken
            }),
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_REFRESH_KEY,
                expiresIn: JwtEnum.expiresRefreshToken,
            }),
        ])
        return {
            accessToken,
            refreshToken
        }
    }
    async editUserProfile(userId: number, data: editProfileDTO): Promise<{ status: number, message: string, user?: User }> {
        try {
            const user = await this.userModel.findById(userId);
    
            if (!user) {
                return { status: 404, message: UserMessage.userNotFound };
            }
    
            if (data.email && data.email !== user.email) {
                const existingUserWithEmail = await this.userModel.findOne({ email: data.email });
    
                if (existingUserWithEmail) {
                    return { status: 400, message: UserMessage.emailExist };
                }
            }
    
            user.fullName = data.fullName || user.fullName;
            user.email = data.email || user.email;
            user.avatar = data.avatar || user.avatar;
            user.address = data.address || user.address;
    
            if (data.gender !== undefined) {
                user.gender = data.gender;
            }
    
            const updatedUser = await user.save();

            if (data.avatar) {
                const result = await this.blogRateModel.updateOne(
                    { userId: userId },
                    { $set: { avt: data.avatar } }
                );
                console.log(result);
            }

            return { status: 200, message: UserMessage.editProfileSuccess, user: updatedUser.toObject() };
        } catch (error) {
            return { status: 500, message: 'Internal Server Error' };
        }
    }
    


    async profileDetail(userId: number): Promise<User> {
        try {
            const user = await this.userModel.findById(userId).select('-password -refreshToken');
            if (!user) {
                throw new Error(UserMessage.userNotFound);
            }
            return user.toObject();
        } catch (error) {
            console.error(error);
        }
    }
    async getProfileUserOther(userId: string): Promise<User> {
        try {
            const user = await this.userModel.findById(userId).select('-password -refreshToken -role');
            if (!user) {
                throw new Error(UserMessage.userNotFound);
            }
            return user.toObject();
        } catch (error) {
            console.error(error);
        }
    }
    async changePassword(userId: number, data: ChangePasswordDTO): Promise<ResponseChangePassword> {
        try {
            const { currentPassword, newPassword } = data;
            const user = await this.userModel.findById(userId);

            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

            if (!isCurrentPasswordValid) {
                const response: ResponseChangePassword = new ResponseChangePassword();
                response.isSuccess = false;
                response.statusCode = HttpStatus.BAD_REQUEST;
                response.message = UserMessage.passwordInValid;
                console.log("rés,", response);

                return response;
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedNewPassword;
            await user.save();

            const response: ResponseChangePassword = new ResponseChangePassword();
            response.isSuccess = true;
            response.statusCode = HttpStatus.OK;
            response.message = UserMessage.changePasswordSuccess;
            return response;
        } catch (error) {
            const response: ResponseChangePassword = new ResponseChangePassword();
            response.isSuccess = false;
            response.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            response.message = UserMessage.changePasswordFail;
            return response;
        }
    }


    async getAllRenters(limit: number = LIMIT_DOCUMENT, page: number = 1, search: string): Promise<any> {
        const skipNumber = (page - 1) * limit;
        const conditions = {
            $or: [
                { fullName: { $regex: search, $options: 'i' } },
            ],
            $and: [{ role: UserRole.RENTER }]
        };
        const searchQuery = search ? conditions : { role: UserRole.RENTER };
        const totalRenter = await this.userModel.countDocuments(searchQuery)
        const allRenter = await this.userModel
            .find(searchQuery)
            .skip(skipNumber)
            .limit(limit)
        const response = {
            totalRenter,
            allRenter,
            currentPage: (page),
            limit: (limit)
        }
        return response
    }
    async toggleBlockUser(userId: string, blockReason: string): Promise<{ status: number; message: string } | User> {
        try {
            const user = await this.userModel.findById(userId);
            if (!user) {
                return { status: 404, message: UserMessage.userNotFound };
            }
            const isBlocked = user.block?.isBlock || false;
            if (isBlocked) {
                user.block = {
                    isBlock: false,
                    content: '',
                    day: null,
                };
                await user.save();
                return { status: 200, message: UserMessage.unBlockUserSuccessfully };
            } else {
                user.block = {
                    isBlock: true,
                    content: blockReason,
                    day: new Date(),
                };
                await user.save();
                return { status: 200, message: UserMessage.toggleBlockUserSuccessfully };
            }
        } catch (error) {
            console.error("Error toggling block status:", error);
            return { status: 500, message: "Internal server error" };
        }
    }
    async getAllUsers(limit: number = LIMIT_DOCUMENT, page: number = 1, search: string): Promise<any> {
        const skipNumber = (page - 1) * limit;
        const conditions = {
            $or: [
                { fullName: { $regex: search, $options: 'i' } },
            ],
            $and: [{ role: { $in: [UserRole.RENTER, UserRole.LESSOR] } }]
        };
        const searchQuery = search ? conditions : { role: { $in: [UserRole.RENTER, UserRole.LESSOR] } };
        const totalUser = await this.userModel.countDocuments(searchQuery)
        const allUser = await this.userModel
            .find(searchQuery)
            .skip(skipNumber)
            .limit(limit)
        const response = {
            totalUser,
            allUser,
            currentPage: (page),
            limit: (limit)
        }
        return response
    }
    async getAllLessors(limit: number = LIMIT_DOCUMENT, page: number = 1, search: string): Promise<any> {
        const skipNumber = (page - 1) * limit;
        const conditions = {
            $or: [
                { fullName: { $regex: search, $options: 'i' } },
            ],
            $and: [{ role: UserRole.LESSOR }]
        };
        const searchQuery = search ? conditions : { role: UserRole.LESSOR };
        const totalLessor = await this.userModel.countDocuments(searchQuery)
        const allLessor = await this.userModel
            .find(searchQuery)
            .skip(skipNumber)
            .limit(limit)
        const response = {
            totalLessor,
            allLessor,
            currentPage: (page),
            limit: (limit)
        }
        return response
    }
    // tích hợp search ở
    async getAllBlogPostByUserId(userId: number, limit: number = LIMIT_DOCUMENT, page: number = 1, search: string): Promise<any> {
        const skipNumber = (page - 1) * limit;
        const conditions = {
            $or: [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ],
            $and: [
                { userId }
            ]
        };
        const searchQuery = search ? conditions : { userId };
        const totalBlog = await this.blogModel.countDocuments(searchQuery)
        const allBlog = await this.blogModel
            .find(searchQuery)
            .skip(skipNumber)
            .limit(limit)
        const response = {
            totalBlog,
            allBlog,
            currentPage: (page),
            limit: (limit)
        }
        return response
    }
    async getAllFavouriteBlogsByUserId(userId: number, limit: number = LIMIT_DOCUMENT, page: number = 1): Promise<any> {
        const skipNumber = (page - 1) * limit;
        const user = await this.userModel.findById(userId)
        const allBlog = await this.userModel
            .find({ _id: userId })
            .skip(skipNumber)
            .limit(limit)
            .populate('blogsFavorite');
        const response = {
            totalBlog: user.blogsFavorite.length,
            allBlog,
            currentPage: (page),
            limit: (limit)
        }
        return response
    }

    async checkFavoriteBlog(blogId: string, currentUser: JwtDecode) {
        const user = await this.userModel.findById(currentUser.id);
        if (!user) {
            throw new Error(UserMessage.userNotFound);
        }
        const blog = await this.blogModel.findById(blogId);
        if (!blog) {
            throw new Error(UserMessage.blogNotFound);
        }
        const isFavorite = user.blogsFavorite.some(favoriteBlogId => favoriteBlogId.toString() === blogId.toString());
        if (isFavorite) {
            return ResponseHelper.response(
                HttpStatus.OK,
                Subject.FAVORITEBLOG,
                Content.CHECK,
                true,
            );
        } else {
            return ResponseHelper.response(
                HttpStatus.OK,
                Subject.FAVORITEBLOG,
                Content.CHECK,
                false,
            );
        }

    }

    async getWeeklySignUpCount(currentUser: JwtDecode) {
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

        const count = await this.userModel.countDocuments({
            createdAt: { $gte: startOfWeek, $lt: endOfWeek },
        });

        return count;
    }

}
