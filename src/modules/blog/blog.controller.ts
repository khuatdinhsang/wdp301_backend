/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiTags } from "@nestjs/swagger";
import { BlogService } from "./blog.service";
import { ResponseBlog, createBlogDTO, detailBlogDTO, editBlogDTO, getAllDTO } from "./dto";
import { BlogMessage } from "src/enums";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../auth/decorator/user.decorator";
import { JwtDecode } from "../auth/types";
@ApiTags('Blog')
@Controller("blog")
export class BlogController {
    constructor(private blogService: BlogService) { }
    @Post('create')
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOkResponse({
        type: () => ResponseBlog,
    })
    async createBlog(@Body() body: createBlogDTO, @CurrentUser() currentUser: JwtDecode): Promise<ResponseBlog> {
        const response = new ResponseBlog()
        try {
            response.setSuccess(HttpStatus.OK, BlogMessage.CreateBlogSuccess, await this.blogService.createBlog(body, currentUser))
            return response
        } catch (error) {
            response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message)
            return response
        }
    }
    @Get('detail/:id')
    @ApiParam({ name: 'id', description: 'ID of the blog' })
    @HttpCode(200)
    @ApiOkResponse({
        type: () => ResponseBlog,
    })
    async viewDetailBlog(@Param('id') id: detailBlogDTO): Promise<ResponseBlog> {
        const response = new ResponseBlog()
        try {
            response.setSuccess(HttpStatus.OK, BlogMessage.detailBlogSuccess, await this.blogService.detailBlog(id))
            return response
        } catch (error) {
            response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message)
            return response
        }
    }
    @Get('getAll/:category')
    @ApiParam({ name: 'category', description: 'Category of the blog' })
    @HttpCode(200)
    @ApiOkResponse({
        type: () => ResponseBlog,
    })
    async getAllBlog(@Param('category') category: getAllDTO): Promise<ResponseBlog> {
        const response = new ResponseBlog()
        try {
            response.setSuccess(HttpStatus.OK, BlogMessage.allBlogSuccess, await this.blogService.getAllBlog(category))
            return response
        } catch (error) {
            response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message)
            return response
        }
    }
    @Put('hidden/:id')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiParam({ name: 'id', description: 'ID of the blog' })
    @HttpCode(200)
    @ApiOkResponse({
        type: () => ResponseBlog,
    })
    async isHideBlog(@Param('id') id: detailBlogDTO): Promise<ResponseBlog> {
        const response = new ResponseBlog()
        try {
            response.setSuccess(HttpStatus.OK, BlogMessage.hiddenBlogSuccess, await this.blogService.hiddenBlog(id))
            return response
        } catch (error) {
            response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message)
            return response
        }
    }
    @Put('edit/:id')
    @UseGuards(AuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiParam({ name: 'id', description: 'ID of the blog' })
    @HttpCode(200)
    @ApiOkResponse({
        type: () => ResponseBlog,
    })
    async editBlog(@Param('id') id: detailBlogDTO, @Body() body: editBlogDTO): Promise<ResponseBlog> {
        const response = new ResponseBlog()
        try {
            response.setSuccess(HttpStatus.OK, BlogMessage.updateBlogSuccess, await this.blogService.editBlog(id, body))
            return response
        } catch (error) {
            response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message)
            return response
        }
    }
}

