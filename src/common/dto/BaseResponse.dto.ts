/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
export abstract class BaseResponse {
    @ApiProperty({
        example: true,
    })
    isSuccess: boolean;
    @ApiProperty({
        example: 200,
    })
    statusCode: number;

    @ApiProperty({
        example: 'string',
    })
    message: string | null;

    setError(code: number, message: string) {
        this.statusCode = code;
        this.isSuccess = false;
        this.message = message;
    }
}