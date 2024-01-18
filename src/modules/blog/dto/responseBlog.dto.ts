/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Blog } from '../schemas/blog.schemas';
import { BaseResponse } from 'src/common/dto/BaseResponse.dto';

export class ResponseBlog extends BaseResponse {
    @ApiProperty({ example: null, type: () => Blog })
    data: Blog | Blog[];
    setSuccess(code: number, message: string, data: Blog | Blog[]) {
        this.statusCode = code;
        this.isSuccess = true;
        this.message = message;
        this.data = data
    }
}
