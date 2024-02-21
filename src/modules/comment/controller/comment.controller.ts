import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";
import { ObjectId } from "mongoose";
import { Content } from "src/enums/content.enum";
import { Field } from "src/enums/field.enum";
import { Subject } from "src/enums/subject.enum";
import { AuthGuardUser } from "src/modules/auth/auth.guard";
import ResponseHelper from "src/utils/respones.until";
import { createCommentDto, detailCommentDTO, getAllCommentDTO, updateCommentDto } from "../dtos/comment.dto";
import { CommentService } from "../service/comment.service";
import { FileInterceptor } from "@nestjs/platform-express/multer";

@ApiTags('Comment')
@Controller("comment")

export class commentController{
    constructor(private commentService: CommentService) { }
    @Post('create')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    @HttpCode(200)
    @UseGuards(AuthGuardUser)
    @ApiBearerAuth('JWT-auth')
    @ApiOkResponse({
        type: () => ResponseHelper,
    })
    async create(
        @Body() payload: createCommentDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        try {
            const result = await this.commentService.create({...payload, file: file})
            return ResponseHelper.response(
                HttpStatus.OK,
                Subject.FEEDBACK,
                Content.SUCCESSFULLY,
                result,
                Field.CREATE
            )
        } catch (error) {
            return ResponseHelper.response(
                HttpStatus.INTERNAL_SERVER_ERROR,
                Subject.FEEDBACK,
                Content.FAILED,
                error,
                Field.CREATE
            )
        }
    }

    @Get('GetAll')
    @HttpCode(200)
    @UseGuards(AuthGuardUser)
    @ApiBearerAuth('JWT-auth')
    @ApiOkResponse({
        type: () => ResponseHelper,
    })
    async getAll(@Body() payload: getAllCommentDTO): Promise<ResponseHelper> {
        try {
            const result = await this.commentService.getAll(payload)
            return ResponseHelper.response(
                HttpStatus.OK,
                Subject.FEEDBACK,
                Content.SUCCESSFULLY,
                result,
                Field.READ
            )
        } catch (error) {
            return ResponseHelper.response(
                HttpStatus.INTERNAL_SERVER_ERROR,
                Subject.FEEDBACK,
                Content.FAILED,
                error,
                Field.READ
            )
        }
    }

    @Patch('update/:id')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    @ApiParam({ name: 'id', description: 'ID of the comment', required: true })
    @HttpCode(200)
    @UseGuards(AuthGuardUser)
    @ApiBearerAuth('JWT-auth')
    @ApiOkResponse({
        status: 200,
        description: 'Cập nhật thành công',
    })
    async update(
        @Param('id') id: detailCommentDTO,
        @Body() payload: updateCommentDto,
        @UploadedFile() file: Express.Multer.File,
        ) {
        try {
            const result = await this.commentService.update(id, {...payload, file: file})
            return result
        } catch (error) {
            return ResponseHelper.response(
                HttpStatus.INTERNAL_SERVER_ERROR,
                Subject.FEEDBACK,
                Content.FAILED,
                error,
                Field.UPDATE
            )
        }
    }

    @Delete('delete/:id')
    @HttpCode(200)
    @ApiParam({ name: 'id', description: 'ID of the comment', required: true })
    @UseGuards(AuthGuardUser)
    @ApiBearerAuth('JWT-auth')
    @ApiOkResponse({
        type: () => ResponseHelper,
    })
    async delete(@Param() id:detailCommentDTO): Promise<ResponseHelper> {
        try {
            const result = await this.commentService.delete(id)
            return result
        } catch (error) {
            return ResponseHelper.response(
                HttpStatus.INTERNAL_SERVER_ERROR,
                Subject.FEEDBACK,
                Content.FAILED,
                error,
                Field.UPDATE
            )
        }
    }


}