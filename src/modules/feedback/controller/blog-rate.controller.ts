/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { Content } from "src/enums/content.enum";
import { Field } from "src/enums/field.enum";
import { Subject } from "src/enums/subject.enum";
import { AuthGuardUser } from "src/modules/auth/auth.guard";
import { CurrentUser } from "src/modules/auth/decorator/user.decorator";
import { JwtDecode } from "src/modules/auth/types";
import ResponseHelper from "src/utils/respones.until";
import { createBlogRateDto, updateBlogRateDto } from "../dtos/blog-rate.dto";
import { BlogRateService } from "../service/blog-rate.service";

@ApiTags('Blog_Rate')
@Controller("blog_rate")

export class BlogRateController {
    constructor(private blogRateService: BlogRateService) { }

    // tạo feedback
    @Post('create')
    @HttpCode(200)
    @UseGuards(AuthGuardUser)
    @ApiBearerAuth('JWT-auth')
    @ApiOkResponse({
        type: () => ResponseHelper,
    })
    async create(
        @Body() payload: createBlogRateDto,
        @CurrentUser() currentUser: JwtDecode,
    ): Promise<ResponseHelper> {
        try {
            const result = await this.blogRateService.create(payload, currentUser)
            return result
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
    // tạm thời chưa dùng api này
    // @Get('GetAll')
    // @HttpCode(200)
    // @ApiOkResponse({
    //     type: () => ResponseHelper,
    // })
    // async getAll(): Promise<ResponseHelper> {
    //     try {
    //         const result = await this.blogRateService.getAll()
    //         return ResponseHelper.response(
    //             HttpStatus.OK,
    //             Subject.FEEDBACK,
    //             Content.SUCCESSFULLY,
    //             result,
    //             Field.READ
    //         )
    //     } catch (error) {
    //         return ResponseHelper.response(
    //             HttpStatus.INTERNAL_SERVER_ERROR,
    //             Subject.FEEDBACK,
    //             Content.FAILED,
    //             error,
    //             Field.READ
    //         )
    //     }
    // }


    // lấy tất cả các feedback của 1 blog
    @Get('GetAll/:blogId')
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'page', required: false })
    @HttpCode(200)
    @ApiOkResponse({
        type: () => ResponseHelper,
    })
    async getAllByBlogId(
        @Param('blogId') blogid: string,
        @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
        @Query('page', new ParseIntPipe({ optional: true })) page: number,
    ): Promise<ResponseHelper> {
        try {
            const result = await this.blogRateService.getAllByBlogId(blogid, limit, page)
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
    // check comment 1 lần --> sau thầy lại bảo comment nhiều lần 
    @Get('check/:blogId')
    @HttpCode(200)
    @UseGuards(AuthGuardUser)
    @ApiBearerAuth('JWT-auth')
    @ApiOkResponse({
        type: () => ResponseHelper,
    })
    async CheckExistedBlog(@Param('blogId') blogid: string, @CurrentUser() currentUser: JwtDecode,) {
        try {
            const result = await this.blogRateService.CheckExistedBlog(blogid, currentUser)
            return ResponseHelper.response(
                HttpStatus.OK,
                Subject.FEEDBACK,
                Content.SUCCESSFULLY,
                result,
                Field.CHECK
            )
        } catch (error) {
            return ResponseHelper.response(
                HttpStatus.INTERNAL_SERVER_ERROR,
                Subject.FEEDBACK,
                Content.FAILED,
                error,
                Field.CHECK
            )
        }
    }

    // update feedback
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

    // xóa feedback
    @Delete('delete/:id')
    @HttpCode(200)
    @UseGuards(AuthGuardUser)
    @ApiBearerAuth('JWT-auth')
    @ApiOkResponse({
        type: () => ResponseHelper,
    })
    async delete(@Param('id') id: string): Promise<ResponseHelper> {
        try {
            const result = await this.blogRateService.delete(id)
            return result
        } catch (error) {
            return ResponseHelper.response(
                HttpStatus.INTERNAL_SERVER_ERROR,
                Subject.FEEDBACK,
                Content.FAILED,
                error,
                Field.DELETE
            )
        }
    }


}