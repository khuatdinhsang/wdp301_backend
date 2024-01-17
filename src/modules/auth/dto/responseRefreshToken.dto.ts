/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/dto/BaseResponse.dto';

export abstract class dataTypeRefreshToken {
    @ApiProperty()
    accessToken: string;
    @ApiProperty()
    refreshToken: string;
}
export class ResponseRefreshToken extends BaseResponse {
    @ApiProperty({ example: null, type: () => dataTypeRefreshToken })
    data: dataTypeRefreshToken;

    setSuccess(code: number, message: string, data: dataTypeRefreshToken) {
        this.statusCode = code;
        this.isSuccess = true;
        this.message = message;
        this.data = data
    }
}
