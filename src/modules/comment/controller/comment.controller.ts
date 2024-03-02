/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Content } from "src/enums/content.enum";
import { Field } from "src/enums/field.enum";
import { Subject } from "src/enums/subject.enum";
import { AuthGuardUser } from "src/modules/auth/auth.guard";
import ResponseHelper from "src/utils/respones.until";
import { CreateCommentDto, UpdateCommentDto } from "../dtos/comment.dto";
import { CommentService } from "../service/comment.service";
import { CurrentUser } from "src/modules/auth/decorator/user.decorator";
import { JwtDecode } from "src/modules/auth/types/jwt.type";
@ApiTags('Comment')
@Controller("comment")

export class CommentController {
    constructor(private commentService: CommentService) { }
    @Post('create')
    @HttpCode(200)
    @UseGuards(AuthGuardUser)
    @ApiBearerAuth('JWT-auth')
    @ApiOkResponse({
        type: () => ResponseHelper,
    })
    async create(
        @Body() payload: CreateCommentDto,
        @CurrentUser() currentUser: JwtDecode,
    ): Promise<ResponseHelper> {
        try {
            const result = await this.commentService.create(payload, currentUser)
            return ResponseHelper.response(
                HttpStatus.OK,
                Subject.COMMENT,
                Content.SUCCESSFULLY,
                result,
                Field.CREATE
            )
        } catch (error) {
            return ResponseHelper.response(
                HttpStatus.INTERNAL_SERVER_ERROR,
                Subject.COMMENT,
                Content.FAILED,
                error,
                Field.CREATE
            )
        }
    }

    @Get('GetAll')
    @HttpCode(200)
    @ApiOkResponse({
        type: () => ResponseHelper,
    })
    // async getAll(): Promise<ResponseHelper> {
    //     try {
    //         const result = await this.commentService.getAll()
    //         return ResponseHelper.response(
    //             HttpStatus.OK,
    //             Subject.COMMENT,
    //             Content.SUCCESSFULLY,
    //             result,
    //             Field.READ
    //         )
    //     } catch (error) {
    //         return ResponseHelper.response(
    //             HttpStatus.INTERNAL_SERVER_ERROR,
    //             Subject.COMMENT,
    //             Content.FAILED,
    //             error,
    //             Field.READ
    //         )
    //     }
    // }

    @Get('GetAll/:feedbackId')
    @HttpCode(200)
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'page', required: false })
    @ApiOkResponse({
        type: () => ResponseHelper,
    })
    async getAllByBlogId(
        @Param('feedbackId') feedbackId: string,
        @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
        @Query('page', new ParseIntPipe({ optional: true })) page: number,
    ): Promise<ResponseHelper> {
        try {
            const result = await this.commentService.getAllByFeedbackId(feedbackId, limit, page)
            return ResponseHelper.response(
                HttpStatus.OK,
                Subject.COMMENT,
                Content.SUCCESSFULLY,
                result,
                Field.READ
            )
        } catch (error) {
            return ResponseHelper.response(
                HttpStatus.INTERNAL_SERVER_ERROR,
                Subject.COMMENT,
                Content.FAILED,
                error,
                Field.READ
            )
        }
    }


    @Patch('update/:id')
    @HttpCode(200)
    @UseGuards(AuthGuardUser)
    @ApiBearerAuth('JWT-auth')
    @ApiOkResponse({
        status: 200,
        description: 'Cập nhật thành công',
    })
    async update(
        @Param('id') id: string,
        @Body() payload: UpdateCommentDto,
    ) {
        try {
            const result = await this.commentService.update(id, payload)
            return result
        } catch (error) {
            return ResponseHelper.response(
                HttpStatus.INTERNAL_SERVER_ERROR,
                Subject.COMMENT,
                Content.FAILED,
                error,
                Field.UPDATE
            )
        }
    }

    @Delete('delete/:id')
    @HttpCode(200)
    @UseGuards(AuthGuardUser)
    @ApiBearerAuth('JWT-auth')
    @ApiOkResponse({
        type: () => ResponseHelper,
    })
    async delete(@Param('id') id: string): Promise<ResponseHelper> {
        try {
            const result = await this.commentService.delete(id)
            return result
        } catch (error) {
            return ResponseHelper.response(
                HttpStatus.INTERNAL_SERVER_ERROR,
                Subject.COMMENT,
                Content.FAILED,
                error,
                Field.DELETE
            )
        }
    }


}