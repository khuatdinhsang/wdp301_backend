/* eslint-disable prettier/prettier */
import { BaseResponse } from './baseResponse.dto';

export class ResponseDataDTO<T> extends BaseResponse {
    data: T;
    setSuccess(code: number, data: T, isSuccess: boolean) {
        this.statusCode = code;
        this.isSuccess = isSuccess;
        this.data = data;
    }
}
