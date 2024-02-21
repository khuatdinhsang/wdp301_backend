import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, NotEquals } from "class-validator";
import { ObjectId } from "mongoose";

export class createCommentDto {

    @IsNotEmpty()
    @NotEquals(null)
    @ApiProperty({
        description: 'content comment',
        default: 'comment 1',
      })
    content: string;
    
    @ApiProperty({ type: 'string', format: 'binary', required: false })
    file: Express.Multer.File;

    @IsNotEmpty()
    @NotEquals(null)
    @ApiProperty({
        description: 'người đánh giá',
      })
    feedBackId: ObjectId;
}
export class updateCommentDto {
    @IsNotEmpty()
    @NotEquals(null)
    @ApiProperty({
        description: 'content comment',
        default: 'comment 1',
      })
    content: string;
    
    @ApiProperty({ type: 'string', format: 'binary', required: false })
    file: Express.Multer.File;
}

export class getAllCommentDTO {
    @ApiProperty({
    })
    feedBackId: ObjectId
}

export class detailCommentDTO {
    @ApiProperty({
        example: '65a8944d9aae07aa4a0ac615',
    })
    id: ObjectId
}