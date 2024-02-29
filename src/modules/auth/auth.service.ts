/* eslint-disable prettier/prettier */
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from './schemas/user.schemas';
import * as bcrypt from 'bcrypt';
import { HttpEnum, JwtEnum, UserMessage, UserRole } from 'src/enums';
import { LoginDTO, dataTypeLogin, editProfileDTO, ChangePasswordDTO, refreshTokenDTO, registerDTO } from './dto';
import { JwtDecode, JwtPayload, Tokens } from './types';
import { Jwt } from 'src/common/jwt';
import { detailBlogDTO } from '../blog/dto';
import { Blog } from '../blog/schemas/blog.schemas';
import { skip } from 'node:test';
import ResponseHelper from 'src/utils/respones.until';
import { Subject } from 'src/enums/subject.enum';
import { Content } from 'src/enums/content.enum';
@Injectable({})
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Blog.name) private blogModel: Model<Blog>,
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
        if(isFavorite){
            return ResponseHelper.response(
                HttpStatus.OK,
                Subject.UNFAVORITEBLOG,
                Content.SUCCESSFULLY,
                user,
            );
        }else{
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

            if (data.phone && data.phone !== user.phone) {
                const existingUserWithPhone = await this.userModel.findOne({ phone: data.phone });

                if (existingUserWithPhone) {
                    return { status: 400, message: UserMessage.phoneExist };
                }
            }

            user.fullName = data.fullName || user.fullName;
            user.email = data.email || user.email;
            user.avatar = data.avatar || user.avatar;
            user.address = data.address || user.address;
            user.gender = data.gender || user.gender;

            const updatedUser = await user.save();

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
    async changePassword(userId: number, data: ChangePasswordDTO): Promise<{ status: number, message: string, user?: User }> {
        try {
            const { currentPassword, newPassword } = data;
            const user = await this.userModel.findById(userId);

            if (!user) {
                return { status: 404, message: UserMessage.userNotFound };
            }

            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                return { status: 400, message: UserMessage.passwordInValid };
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedNewPassword;
            await user.save();

            return { status: 200, message: UserMessage.changePasswordSuccess };
        } catch (error) {
            return { status: 500, message: 'Internal Server Error' };
        }
    }


    async getAllRenters(page: number): Promise<User[]> {
        const pageSize = 10;
        const skip = (page - 1) * pageSize;
        return this.userModel.find({ role: UserRole.RENTER }).skip(skip).limit(pageSize).exec();
    }
    async toggleBlockUser(userId: string, blockReason: string): Promise<{ status: number; message: string } | User> {
        try {
            const user = await this.userModel.findById(userId);
            if (!user) {
                return { status: 404, message: UserMessage.userNotFound };
            }
    
            user.block = {
                isBlock: !user.block?.isBlock || false,
                content: blockReason,
                day: new Date(),
            };
    
            await user.save();
            if (user.block?.isBlock) {
                return { status: 200, message: UserMessage.toggleBlockUserSuccessfully };
            } else {
                return { status: 200, message: UserMessage.unBlockUserSuccessfully };
            }
        } catch (error) {
            console.error("Error toggling block status:", error);
            return { status: 500, message: "Internal server error" };
        }
    }
    async getAllUsers(page: number): Promise<User[]> {
        const pageSize = 10;
        const skip = (page - 1) * pageSize;
        return this.userModel.find({ role: { $in: [UserRole.RENTER, UserRole.LESSOR] } }).skip(skip).limit(pageSize).exec();

    }
    async getAllLessors(page: number): Promise<User[]> {
        const pageSize = 10;
        const skip = (page - 1) * pageSize;
        return this.userModel.find({ role: UserRole.LESSOR }).skip(skip).limit(pageSize).exec();
    }
    async getAllBlogPostByUserId(userId: number, page: number): Promise<Blog[]> {
        const pageSize = 10;
        const skip = (page - 1) * pageSize;
        const user = await this.userModel.findById(userId).populate('blogsPost');
        if (!user) {
            return [];
        }
        const blogPosts = user.blogsPost.slice(skip, skip + pageSize);
        return blogPosts;
    }
    async getAllFavouriteBlogsByUserId(userId: number, page: number): Promise<Blog[]>{
        const pageSize = 10; 
        const skip = (page - 1) * pageSize;
        const user = (await this.userModel.findById(userId)).populate('blogsFavorite');
        if(!user){
            return [];
        }
        const favoriteBlog = (await user).blogsFavorite.slice(skip, skip + pageSize);
        return favoriteBlog;
    }

}
