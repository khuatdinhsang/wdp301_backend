/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from './schemas/user.schemas';
import * as bcrypt from 'bcrypt'
import { HttpEnum, JwtEnum, UserMessage, UserRole } from 'src/enums';
import { LoginDTO, dataTypeLogin, editProfileDTO, refreshTokenDTO, registerDTO } from './dto';
import { JwtDecode, JwtPayload, Tokens } from './types';
import { Jwt } from 'src/common/jwt';
import { detailBlogDTO } from '../blog/dto';
import { Blog } from '../blog/schemas/blog.schemas';
@Injectable({})
export class AuthService {

    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Blog.name) private blogModel: Model<Blog>,
        private jwtService: JwtService
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
    async favoriteBlog(data: detailBlogDTO, currentUser: JwtDecode): Promise<any> {
        const user = await this.userModel.findById(currentUser.id)
        const userUpdated = await this.userModel.findByIdAndUpdate(currentUser.id, { $set: { blogsFavorite: [...user.blogsFavorite, data.id] } }, { new: true })
        await this.blogModel.findByIdAndUpdate(data.id, { $set: { totalFavorite: userUpdated.blogsFavorite.length } }, { new: true })
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
    async editUserProfile(userId: number, data: editProfileDTO): Promise<User> {
        try {
          const user = await this.userModel.findById(userId);
    
          if (!user) {
            throw new Error(UserMessage.userNotFound);
          }
    
          user.fullName = data.fullName;
          if (data.email) user.email = data.email;
          if (data.avatar) user.avatar = data.avatar;
          if (data.fullName) user.fullName = data.fullName;
          if (data.address) user.address = data.address;
          if (data.gender) user.gender = data.gender;
          if (data.phone) user.phone = data.phone;
    
          // Save the changes
          const updatedUser = await user.save();
    
          // Return the updated user
          return updatedUser.toObject();
        } catch (error) {
          console.error(error);
          throw new Error(UserMessage.editUserProfileFail);
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
}
