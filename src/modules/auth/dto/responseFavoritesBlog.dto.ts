/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/dto/BaseResponse.dto';
import { Blog } from 'src/modules/blog/schemas/blog.schemas';

export class ResponseFavoriteBlog extends BaseResponse {
    @ApiProperty({ example: null, type: () => Blog })
    data: Blog[];

    setSuccess(code: number, message: string, data: Blog[]) {
        this.statusCode = code;
        this.isSuccess = true;
        this.message = message;
        this.data = data
    }
}
