/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsMobilePhone, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { UserMessage } from 'src/enums';
import { UserRole } from 'src/enums/role.enum';

export class registerDTO {
    @ApiProperty({
        example: 'Nguyễn Văn A',
    })
    @IsString()
    @IsNotEmpty()
    @Matches(/^[\p{L}\s]+$/u, { message: UserMessage.fullnameIsValid })
    fullName: string;

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
    @ApiProperty({
        example: '123456',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    confirmPassword: string;
    @IsEnum(UserRole, { message: UserMessage.roleNotExist })
    @ApiProperty({
        example: 'renter',
    })
    role: UserRole
    constructor(fullName: string, phone: string, password: string, role: UserRole) {
        this.fullName = fullName;
        this.phone = phone;
        this.password = password
        this.role = role
    }
}
