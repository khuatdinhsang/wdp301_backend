import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/dto/BaseResponse.dto';
import { User } from '../schemas/user.schemas';

export class ResponseProfileDetail extends BaseResponse {
    @ApiProperty({ example: null })
    data: {
        fullName: string;
        email: string;
        password: string;
        avatar: string;
        dateOfBirth: Date;
        gender: boolean;
        phone: string;
        address: string;
        block: Record<string, any>;
        refreshToken: string;
        blogsPost: any[]; 
        blogsFavorite: any[]; 
        role: string;
    };
    
    setSuccess(code: number, message: string, data: User) {
        this.statusCode = code;
        this.isSuccess = true;
        this.message = message;
        this.data = data; 
    }
}