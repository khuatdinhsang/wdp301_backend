  import { ApiProperty } from '@nestjs/swagger';
  import { IsEmail, IsMobilePhone, IsEnum, IsNotEmpty, IsOptional, IsString, IsBoolean, IsDate } from 'class-validator';
  import { UserRole } from 'src/enums/role.enum';
  import { UserMessage } from 'src/enums';

  export class editProfileDTO {
    @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({ example: 'john@example.com', description: 'Email of the user' })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({ example: 'https://example.com/avatar.jpg', description: 'URL of the user avatar' })
    @IsString()
    @IsOptional()
    avatar?: string;

    @ApiProperty({ example: true, description: 'Gender of the user (true for male, false for female)' })
    @IsOptional()
    @IsBoolean()
    gender?: boolean;

    @ApiProperty({ example: '123 Main St', description: 'Address of the user' })
    @IsOptional()
    @IsString()
    address?: string;

  }
