/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserMessage } from 'src/enums';

export class LoginDTO {
    @ApiProperty({
        example: '0923092002',
    })
    @IsString()
    @IsNotEmpty()
    @IsMobilePhone('vi-VN', null, { message: UserMessage.phoneInValid })
    phone: string;

    @ApiProperty({
        example: '123456',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}
