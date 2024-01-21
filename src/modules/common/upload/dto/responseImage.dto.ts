/* eslint-disable prettier/prettier */
import { BaseResponse } from 'src/common/dto/BaseResponse.dto';
export class ResponseImage extends BaseResponse {
    data: string | string[];
    setSuccess(code: number, message: string, data: string | string[]) {
        this.statusCode = code;
        this.isSuccess = true;
        this.message = message;
        this.data = data
    }
}
