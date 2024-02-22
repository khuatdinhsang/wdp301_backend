import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsString, NotEquals, isMongoId } from "class-validator";
import { ObjectId } from "mongoose";
import { Content } from "src/enums/content.enum";
import { Subject } from "src/enums/subject.enum";
import ResponseHelper from "src/utils/respones.until";

export class createBlogRateDto {
    @IsNotEmpty({
      message: ResponseHelper.responseDto(
        Subject.FEEDBACK,
        Content.REQUIRED,
        "star"
      )
    })
    @NotEquals(null,{
      message: ResponseHelper.responseDto(
        Subject.FEEDBACK,
        Content.NOT_NULL,
        "star"
      )
    })
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

      @IsNotEmpty()
      @ApiProperty({
        description: 'bài đăng',
        example: '65d6237ed678344ce486b08f',
      })
      blogId: string;

      @ApiProperty({ type: 'string', format: 'binary', required: false })
      file: Express.Multer.File[];
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
    feedback: string;
    
}

export class detailBlogRateDTO {
  @ApiProperty({
    example: '65a8944d9aae07aa4a0ac615',
  })
  id: string
}
