import { ApiProperty } from '@nestjs/swagger';
import { BaseResponse } from 'src/common/dto/BaseResponse.dto';
import { User } from '../schemas/user.schemas';

export class ResponseToggleBlockUser extends BaseResponse {
    @ApiProperty({ description: 'User information after toggling block status', type: User, required: false })
    user?: User;
}
