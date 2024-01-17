/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../schemas/user.schemas';
import { BaseResponse } from 'src/common/BaseResponse.dto';

export class ResponseRegister extends BaseResponse {
    @ApiProperty({ example: null, type: () => User })
    data: User;

    setSuccess(code: number, message: string, data: User) {
        this.statusCode = code;
        this.isSuccess = true;
        this.message = message;
        this.data = data
    }
}
