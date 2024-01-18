/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsString, IsArray, IsBoolean, IsDateString } from "class-validator";
import { BlogMessage, CategoryRoom, HasTagRoom, RentalObject } from "src/enums";
export class createBlogDTO {
    @ApiProperty({
        example: CategoryRoom.RENT,
    })
    @IsEnum(CategoryRoom, { message: BlogMessage.categoryInValid })
    @IsNotEmpty()
    category: CategoryRoom

    @ApiProperty({
        example: HasTagRoom.RENT,
    })
    @IsEnum(HasTagRoom, { message: BlogMessage.HasTagInValid })
    @IsNotEmpty()
    hasTag: HasTagRoom;

    @ApiProperty({
        example: 'title...',
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        example: 'description...',
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        example: 20,
    })
    @IsNumber()
    area: number;

    @ApiProperty({
        example: 2000000,
    })
    @IsNumber()
    money: number;

    @ApiProperty({
        example: ["http://img1.jpg", "http://img2.jpg"],
    })
    @IsArray()
    @IsString({ each: true })
    image: string[];

    @ApiProperty({
        example: ["http://video1.jpg", "http://video2.jpg"],
    })
    @IsArray()
    @IsString({ each: true })
    video: string[];

    @ApiProperty({
        example: 'số nhà 20, ngõ 6, thôn 3',
    })
    @IsString()
    addressDetail: string;

    @ApiProperty({
        example: 2,
    })
    @IsNumber()
    totalRoom: number;

    @ApiProperty({
        example: RentalObject.BOTH,
    })
    @IsEnum(RentalObject, { message: BlogMessage.RentalObjectInValid })
    rentalObject: RentalObject;

    @ApiProperty({
        example: true,
    })
    @IsBoolean()
    isAccepted: boolean;

    @ApiProperty({
        example: '2024-09-23',
    })
    @IsDateString()
    expiredTime: Date;

    @ApiProperty({
        example: false,
    })
    @IsBoolean()
    isHide: boolean;

    @ApiProperty({
        example: false,
    })
    @IsBoolean()
    isRented: boolean;
    @ApiProperty({
        example: 4,
    })
    @IsNumber()
    star: number;
}
