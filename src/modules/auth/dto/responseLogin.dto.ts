/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/BaseResponse.dto';

export abstract class dataTypeLogin {
    @ApiProperty()
    accessToken: string;
    @ApiProperty()
    refreshToken: string;
}
export class ResponseLogin extends BaseResponse {
    @ApiProperty({ example: null, type: () => dataTypeLogin })
    data: dataTypeLogin;

    setSuccess(code: number, message: string, data: dataTypeLogin) {
        this.statusCode = code;
        this.isSuccess = true;
        this.message = message;
        this.data = data
    }
}
