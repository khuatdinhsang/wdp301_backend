import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsMobilePhone, IsEnum, IsNotEmpty, IsOptional, IsString, IsBoolean, IsDate } from 'class-validator';
import { UserRole } from 'src/enums/role.enum';
import { UserMessage } from 'src/enums';

export class ChangePasswordDTO {
    @ApiProperty({ description: 'Current password' })
    @IsNotEmpty({ message: 'Current password must not be empty' })
    @IsString({ message: 'Current password must be a string' })
    currentPassword: string;

    @ApiProperty({ description: 'New password' })
    @IsNotEmpty({ message: 'New password must not be empty' })
    @IsString({ message: 'New password must be a string' })
    newPassword: string;
}