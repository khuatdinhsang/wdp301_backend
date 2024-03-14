import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsMongoId, IsNotEmpty, IsString, Max, Min, NotEquals, isMongoId } from "class-validator";
import { ObjectId } from "mongoose";
import { Content } from "src/enums/content.enum";
import { Subject } from "src/enums/subject.enum";
import ResponseHelper from "src/utils/respones.until";

export class createBlogRateDto {
    @IsInt({
      message: ResponseHelper.responseDto(
        Subject.FEEDBACK,
        Content.INVALID,
        "star"
        )
      })
    @Min(1, {
      message: ResponseHelper.responseDto(
        Subject.FEEDBACK,
        Content.MIN_VALUE,
        "star",
        )
      })
    @Max(5, {
      message: ResponseHelper.responseDto(
        Subject.FEEDBACK,
        Content.MAX_VALUE,
        "star",
        )
      })
    @ApiProperty({
        description: 'điểm đánh giá',
        default: '1',
      })
    star: number;
    
    @IsString()
    @ApiProperty({
        description: 'đánh giá',
        default: 'đánh giá 1',
      })
      title: string;

      @IsNotEmpty()
      @ApiProperty({
        description: 'bài đăng',
        example: '65d6237ed678344ce486b08f',
      })
      blogId: string;

      @ApiProperty({
        example: ["http://img1.jpg", "http://img2.jpg"],
      })
      @IsArray()
      @IsString({ each: true })
      file: string[];
}
export class blogFeedbackDTO{
  @ApiProperty({
      description: 'bài đăng',
      example: '65d6237ed678344ce486b08f',
    })
    blogId: string;
}
export class updateBlogRateDto {
    @IsNotEmpty()
    @NotEquals(null)
    @ApiProperty({
        description: 'điểm đánh giá',
        default: '0',
      })
    star: number;
    
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

export class detailBlogRateDTO {
  @ApiProperty({
    example: '65a8944d9aae07aa4a0ac615',
  })
  id: string
}
