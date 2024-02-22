import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { Content } from "src/enums/content.enum";
import { Field } from "src/enums/field.enum";
import { Subject } from "src/enums/subject.enum";
import { AuthGuardUser } from "src/modules/auth/auth.guard";
import { CurrentUser } from "src/modules/auth/decorator/user.decorator";
import { JwtDecode } from "src/modules/auth/types";
import ResponseHelper from "src/utils/respones.until";
import { blogFeedbackDTO, createBlogRateDto, detailBlogRateDTO, updateBlogRateDto } from "../dtos/blog-rate.dto";
import { BlogRateService } from "../service/blog-rate.service";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express/multer";

@ApiTags('Blog_Rate')
@Controller("blog_rate")

export class BlogRateController{
    constructor(private blogRateService: BlogRateService) { }
    @Post('create')
    @HttpCode(200)
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: createBlogRateDto })
    @UseInterceptors(FilesInterceptor('file', 5))
    @UseGuards(AuthGuardUser)
    @ApiBearerAuth('JWT-auth')
    @ApiOkResponse({
        type: () => ResponseHelper,
    })
    async create(
         @Body() payload: createBlogRateDto,
         @CurrentUser() currentUser: JwtDecode,
         @UploadedFiles() file: Array<Express.Multer.File>,
        ): Promise<ResponseHelper> {
        try {
            const result = await this.blogRateService.create({...payload, file: file}, currentUser)
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
        @Param('id') id:string,
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