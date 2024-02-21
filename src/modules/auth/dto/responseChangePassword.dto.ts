import { ApiProperty } from '@nestjs/swagger';
import { User } from '../schemas/user.schemas';
import { BaseResponse } from 'src/common/dto/BaseResponse.dto';

export class ResponseChangePassword extends BaseResponse {
    @ApiProperty({ description: 'Updated user information' })
    user: User;
    @ApiProperty({ description: 'Flag indicating if the password change was successful' })
    success: boolean;
}
