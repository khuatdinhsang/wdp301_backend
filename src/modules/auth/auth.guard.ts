/* eslint-disable prettier/prettier */
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { User } from './schemas/user.schemas';
import { UserRole } from 'src/enums';
// import { UserEntity } from '../user/entities/User.entity';

@Injectable()
export class AuthGuardUser implements CanActivate {
    constructor(private jwtService: JwtService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_ACCESS_KEY
            });
            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    // ** Role check
    static isAdmin(user: User) {
        return user.role === UserRole.ADMIN;
    }
    static isRenter(user: User) {
        return user.role === UserRole.RENTER;
    }
    static isLessor(user: User) {
        return user.role === UserRole.LESSOR;
    }
    static isGuest(user: User) {
        return user.role === UserRole.GUEST;
    }
}
