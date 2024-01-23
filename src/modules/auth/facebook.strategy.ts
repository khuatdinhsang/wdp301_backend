/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-facebook';
import { User } from './schemas/user.schemas';
import { Model } from 'mongoose';
import { AuthService } from './auth.service';
import { InjectModel } from '@nestjs/mongoose';
import { UserRole } from 'src/enums';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private authService: AuthService
    ) {
        super({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL,
            passReqToCallback: true,
            profileFields: ['id', 'displayName', 'emails', 'photos'],
        });
    }

    async validate(request: any, accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const user = {
            id: profile.id,
            fullName: profile.displayName,
            picture: profile?.photos[0]?.value,
        };
        const userExist = await this.userModel.findOne({ idFacebook: user.id })
        if (!userExist) {
            const createdUser = await this.userModel.create(
                {
                    fullName: profile.displayName,
                    idFacebook: user.id,
                    role: UserRole.RENTER
                }
            );
            const payload = { id: createdUser._id.toString(), fullName: createdUser.fullName, role: createdUser.role };
            const tokens = await this.authService.getTokens(payload)
            await this.userModel.findByIdAndUpdate(createdUser._id, { $set: { refreshToken: tokens.refreshToken } }, { new: true })
            done(null, tokens);
        } else {
            const payload = { id: userExist._id.toString(), fullName: userExist.fullName, role: userExist.role };
            const tokens = await this.authService.getTokens(payload)
            await this.userModel.findByIdAndUpdate(userExist._id, { $set: { refreshToken: tokens.refreshToken } }, { new: true })
            done(null, tokens);
        }
        done(null, user);
    }
}