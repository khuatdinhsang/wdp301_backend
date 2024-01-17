/* eslint-disable prettier/prettier */
import { Request } from 'express';

// Jwt import
import { decode } from 'jsonwebtoken';
import { JwtDecode } from 'src/modules/auth/types';

export class Jwt {
    static extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

    static getPayloadToken(token: string): JwtDecode {
        return decode(token) as JwtDecode;
    }
}
