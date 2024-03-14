/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateCommentDto {

  @IsString()
  @ApiProperty({
    description: 'đánh giá',
    default: 'đánh giá 1',
  })
  title: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'bài đăng',
    example: '65dc8a47cccd796be62f226d',
  })
  feedbackId: string;

  @ApiProperty({
    example: ["http://img1.jpg", "http://img2.jpg"],
  })
  @IsArray()
  @IsString({ each: true })
  file: string[];
}
export class UpdateCommentDto {

  @IsString()
  @ApiProperty({
    description: 'đánh giá',
    default: 'đánh giá 1',
  })
  title: string;

  @ApiProperty({
    example: ["http://img1.jpg", "http://img2.jpg"],
  })
  @IsArray()
  @IsString({ each: true })
  file: string[];

}
