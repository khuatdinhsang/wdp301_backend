import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ToggleBlockUserDTO {
    @ApiProperty({ example: 'Lý do block user' })
    @IsNotEmpty()
    @IsString()
    blockReason: string;
}