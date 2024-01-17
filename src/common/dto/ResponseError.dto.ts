/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from './BaseResponse.dto';

export class ResponseError extends BaseResponse {
    @ApiProperty({
        example: null,
    })
    data: null;
    setError(code: number, message: string) {
        this.isSuccess = false;
        this.data = null;
        this.statusCode = code;
        this.message = message;
    }
}
