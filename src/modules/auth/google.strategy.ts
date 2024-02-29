/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { User } from './schemas/user.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { UserRole } from 'src/enums';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private authService: AuthService
    ) {
        super({
            clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
            passReqToCallback: true,
            scope: ['profile', 'email'],
        });
    }

    async validate(
        request: any,
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,


    ): Promise<any> {
        const { emails, photos, id, displayName } = profile;
        const user = {
            id: id,
            email: emails[0]?.value,
            photo: photos[0]?.value,
            fullName: displayName,
        };
        const userExist = await this.userModel.findOne({ email: user.email })
        if (!userExist) {
            const createdUser = await this.userModel.create(
                {
                    fullName: user.fullName,
                    email: user.email,
                    avatar: user.photo,
                    role: UserRole.RENTER
                }
            );
            console.log(createdUser)
            const payload = { id: createdUser._id.toString(), fullName: createdUser.fullName, role: createdUser.role };
            const tokens = await this.authService.getTokens(payload)
            await this.userModel.findByIdAndUpdate(createdUser._id, { $set: { refreshToken: tokens.refreshToken } }, { new: true })
            request.res.redirect('http://localhost:3000')
            done(null, tokens);
        } else {
            const payload = { id: userExist._id.toString(), fullName: userExist.fullName, role: userExist.role };
            const tokens = await this.authService.getTokens(payload)
            await this.userModel.findByIdAndUpdate(userExist._id, { $set: { refreshToken: tokens.refreshToken } }, { new: true })
            request.res.redirect('http://localhost:3000')
            done(null, tokens);
        }
    }
}

