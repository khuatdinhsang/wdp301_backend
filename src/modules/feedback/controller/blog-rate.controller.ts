import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { BlogRateService } from "../service/blog-rate.service";
import { AuthGuardUser } from "src/modules/auth/auth.guard";
import ResponseHelper from "src/utils/respones.until";
import { createBlogRateDto, updateBlogRateDto, detailBlogRateDTO } from "../dtos/blog-rate.dto";
import { Subject } from "src/enums/subject.enum";
import { Content } from "src/enums/content.enum";
import { Field } from "src/enums/field.enum";
import { ObjectId } from "mongoose";

@ApiTags('Blog_Rate')
@Controller("blog_rate")

export class blogRateController{
    constructor(private blogRateService: BlogRateService) { }
    @Post('create')
    @HttpCode(200)
    @UseGuards(AuthGuardUser)
    @ApiBearerAuth('JWT-auth')
    @ApiOkResponse({
        type: () => ResponseHelper,
    })
    async create(@Body() payload: createBlogRateDto): Promise<ResponseHelper> {
        try {
            const result = await this.blogRateService.create(payload)
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
    async getAll(): Promise<ResponseHelper> {
        try {
            const result = await this.blogRateService.getAll()
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
    @HttpCode(200)
    @UseGuards(AuthGuardUser)
    @ApiBearerAuth('JWT-auth')
    @ApiOkResponse({
        status: 200,
        description: 'Cập nhật thành công',
    })
    async update(
        @Param('id') id:detailBlogRateDTO,
        @Body() payload: updateBlogRateDto,
        ) {
        try {
            const result = await this.blogRateService.update(id, payload)
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
    @UseGuards(AuthGuardUser)
    @ApiBearerAuth('JWT-auth')
    @ApiOkResponse({
        type: () => ResponseHelper,
    })
    async delete(@Param() id:detailBlogRateDTO): Promise<ResponseHelper> {
        try {
            const result = await this.blogRateService.delete(id)
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