/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";
export class searchBlogDTO {
    @ApiProperty({
        example: 500000,
    })
    @IsNumber()
    minPrice: number;

    @ApiProperty({
        example: 5000000,
    })
    @IsNumber()
    maxPrice: number;

    @ApiProperty({
        example: 20,
    })
    @IsNumber()
    minArea: number;

    @ApiProperty({
        example: 50,
    })
    @IsNumber()
    maxArea: number;
}
