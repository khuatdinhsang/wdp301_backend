/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class refreshTokenDTO {
    @ApiProperty({
        example: 'string',
    })
    @IsNotEmpty()
    @IsString()
    refreshToken: string;
}
