/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { BlogService } from './blog.service';
import {
  ResponseBlog,
  createBlogDTO,
  editBlogDTO,
  getAllDTO,
} from './dto';
import { BlogMessage } from 'src/enums';
import { AuthGuardUser } from '../auth/auth.guard';
import { CurrentUser } from '../auth/decorator/user.decorator';
import { JwtDecode } from '../auth/types';
@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) { }
  @Post('create')
  @HttpCode(200)
  @UseGuards(AuthGuardUser)
  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({
    type: () => ResponseBlog,
  })
  async createBlog(
    @Body() body: createBlogDTO,
    @CurrentUser() currentUser: JwtDecode,
  ): Promise<ResponseBlog> {
    const response = new ResponseBlog();
    try {
      response.setSuccess(
        HttpStatus.OK,
        BlogMessage.CreateBlogSuccess,
        await this.blogService.createBlog(body, currentUser),
      );
      return response;
    } catch (error) {
      response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
      return response;
    }
  }
  @Get('detail/:id')
  @ApiParam({ name: 'id', description: 'ID of the blog', required: true })
  @HttpCode(200)
  @ApiOkResponse({
    type: () => ResponseBlog,
  })
  async viewDetailBlog(@Param() body: { id: string }): Promise<ResponseBlog> {
    const response = new ResponseBlog();
    try {
      response.setSuccess(
        HttpStatus.OK,
        BlogMessage.detailBlogSuccess,
        await this.blogService.detailBlog(body.id),
      );
      return response;
    } catch (error) {
      response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
      return response;
    }
  }

  @Get('getAll/admin')
  @ApiBearerAuth('JWT-auth')
  @HttpCode(200)
  @UseGuards(AuthGuardUser)
  @ApiOkResponse({
    type: () => ResponseBlog,
  })
  async getAllBlogAdmin(
    @CurrentUser() currentUser: JwtDecode,
  ): Promise<ResponseBlog> {
    const response = new ResponseBlog();
    try {
      response.setSuccess(
        HttpStatus.OK,
        BlogMessage.allBlogSuccess,
        await this.blogService.getAllBlogAdmin(currentUser),
      );
      return response;
    } catch (error) {
      response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
      return response;
    }
  }

  @Get('getAllAccepted/:category')
  @ApiParam({
    name: 'category',
    description: 'Category of the blog',
    required: true,
  })
  @HttpCode(200)
  @ApiOkResponse({
    type: () => ResponseBlog,
  })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'search', required: false })
  async getAllBlog(
    @Param() body: { category: getAllDTO },
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
    @Query('search') search?: string,
  ): Promise<ResponseBlog> {
    const response = new ResponseBlog();
    try {
      response.setSuccess(
        HttpStatus.OK,
        BlogMessage.allBlogSuccess,
        await this.blogService.getAllBlog(body.category, limit, page, search),
      );
      return response;
    } catch (error) {
      response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
      return response;
    }
  }
  @Put('hidden/:id')
  @UseGuards(AuthGuardUser)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'ID of the blog' })
  @HttpCode(200)
  @ApiOkResponse({
    type: () => ResponseBlog,
  })
  async isHideBlog(@Param() body: { id: string }): Promise<ResponseBlog> {
    const response = new ResponseBlog();
    try {
      response.setSuccess(
        HttpStatus.OK,
        BlogMessage.hiddenBlogSuccess,
        await this.blogService.hiddenBlog(body.id),
      );
      return response;
    } catch (error) {
      response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
      return response;
    }
  }
  @Put('edit/:id')
  @UseGuards(AuthGuardUser)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'ID of the blog' })
  @HttpCode(200)
  @ApiOkResponse({
    type: () => ResponseBlog,
  })
  async editBlog(
    @Param('id') id: string,
    @Body() body: editBlogDTO,
  ): Promise<ResponseBlog> {
    const response = new ResponseBlog();
    try {
      response.setSuccess(
        HttpStatus.OK,
        BlogMessage.updateBlogSuccess,
        await this.blogService.editBlog(id, body),
      );
      return response;
    } catch (error) {
      response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
      return response;
    }
  }

  @Put('BlogAccept/:id')
  @UseGuards(AuthGuardUser)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'ID of the blog' })
  @HttpCode(200)
  @ApiOkResponse({
    type: () => ResponseBlog,
  })

  async acceptBlog(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtDecode,
  ) {
    const response = new ResponseBlog();
    try {
      const result = await this.blogService.acceptBlog(id, currentUser)
      return result;
    } catch (error) {
      response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
      return response;
    }
  }


  @Put('BlogDecline/:id')
  @UseGuards(AuthGuardUser)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'ID of the blog' })
  @HttpCode(200)
  @ApiOkResponse({
    type: () => ResponseBlog,
  })
  async declineBlog(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtDecode,
  ) {
    const response = new ResponseBlog();
    try {
      const result = await this.blogService.declineBlog(id, currentUser)
      return result;
    } catch (error) {
      response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
      return response;
    }
  }

  @Put('BlogRented/:id')
  @UseGuards(AuthGuardUser)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'ID of the blog' })
  @HttpCode(200)
  @ApiOkResponse({
    type: () => ResponseBlog,
  })
  async blogRented(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtDecode,
  ) {
    const response = new ResponseBlog();
    try {
      const result = await this.blogService.blogRented(id, currentUser)
      return result;
    } catch (error) {
      response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
      return response;
    }
  }


  @Put('BlogUnrented/:id')
  @UseGuards(AuthGuardUser)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'ID of the blog' })
  @HttpCode(200)
  @ApiOkResponse({
    type: () => ResponseBlog,
  })
  async blogUnrented(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtDecode,
  ) {
    const response = new ResponseBlog();
    try {
      const result = await this.blogService.blogUnrented(id, currentUser)
      return result;
    } catch (error) {
      response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
      return response;
    }
  }

}
