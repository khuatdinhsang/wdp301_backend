/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsString, IsArray, IsOptional } from "class-validator";
import { BlogMessage, CategoryRoom, HasTagRoom, RentalObject } from "src/enums";
export class editBlogDTO {
    @ApiProperty({
        example: CategoryRoom.RENT,
    })
    @IsOptional()
    @IsEnum(CategoryRoom, { message: BlogMessage.categoryInValid })
    category: CategoryRoom

    @ApiProperty({
        example: HasTagRoom.RENT,
    })
    @IsOptional()
    @IsEnum(HasTagRoom, { message: BlogMessage.HasTagInValid })
    hasTag: HasTagRoom;

    @ApiProperty({
        example: 'title...',
    })
    @IsOptional()
    @IsString()
    title: string;

    @ApiProperty({
        example: 'description...',
    })
    @IsOptional()
    @IsString()
    description: string;

    @ApiProperty({
        example: 20,
    })
    @IsOptional()
    @IsNumber()
    area: number;

    @ApiProperty({
        example: 2000000,
    })
    @IsOptional()
    @IsNumber()
    money: number;

    @ApiProperty({
        example: ["http://img1.jpg", "http://img2.jpg"],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    image: string[];

    @ApiProperty({
        example: ["http://video1.jpg", "http://video2.jpg"],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    video: string[];

    @ApiProperty({
        example: 'số nhà 20, ngõ 6, thôn 3',
    })
    @IsOptional()
    @IsString()
    addressDetail: string;

    @ApiProperty({
        example: 2,
    })
    @IsOptional()
    @IsNumber()
    totalRoom: number;

    @ApiProperty({
        example: RentalObject.BOTH,
    })
    @IsOptional()
    @IsEnum(RentalObject, { message: BlogMessage.RentalObjectInValid })
    rentalObject: RentalObject;
}
