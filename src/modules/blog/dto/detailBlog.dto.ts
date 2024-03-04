/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { ObjectId } from "mongoose";
import { CategoryRoom } from "src/enums";
export class detailBlogDTO {
    @ApiProperty({
        example: '65a8944d9aae07aa4a0ac615',
    })
    id: string
}
export class getAllDTO {
    @ApiProperty({
        example: CategoryRoom.RENT,
    })
    category: string
}

export class preBlogDTO {

    @ApiProperty({
    })
    isAccepted: Boolean
}
