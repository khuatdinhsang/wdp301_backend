/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from './schemas/user.schemas';
import * as bcrypt from 'bcrypt'
import { JwtEnum, UserMessage } from 'src/enums';
import { LoginDTO, dataTypeLogin, registerDTO } from './dto';
import { JwtPayload, Tokens } from './types';
@Injectable({})
export class AuthService {

    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
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
        const payload = { id: userExist._id.toString(), fullName: userExist.fullName };
        const tokens = await this.getTokens(payload)
        await this.userModel.findByIdAndUpdate(userExist._id, { $set: { refreshToken: tokens.refreshToken } }, { new: true })
        return tokens
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
}
