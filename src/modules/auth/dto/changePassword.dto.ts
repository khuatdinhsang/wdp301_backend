import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDTO {
    @ApiProperty({ description: 'Current password' })
    @IsNotEmpty({ message: 'Current password must not be empty' })
    @IsString({ message: 'Current password must be a string' })
    currentPassword: string;

    @ApiProperty({ description: 'New password (at least 6 characters)' })
    @IsNotEmpty({ message: 'New password must not be empty' })
    @IsString({ message: 'New password must be a string' })
    @MinLength(6, { message: 'New password must be at least 6 characters long' })
    newPassword: string;
}
