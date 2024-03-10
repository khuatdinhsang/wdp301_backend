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
  searchBlogDTO,
} from './dto';
import { BlogMessage } from 'src/enums';
import { AuthGuardUser } from '../auth/auth.guard';
import { CurrentUser } from '../auth/decorator/user.decorator';
import { JwtDecode } from '../auth/types';
import { ToggleBlockUserDTO } from '../auth/dto/toggleBlockUser.dto';
@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) { }

  // tạo mới blog  -> làm lại
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

  // lấy chi tiết 1 blog 
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


  // lấy tất cả các blog bởi admin
  @Get('getAll/admin')
  @ApiBearerAuth('JWT-auth')
  @HttpCode(200)
  @UseGuards(AuthGuardUser)
  @ApiOkResponse({
    type: () => ResponseBlog,
  })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'search', required: false })
  async getAllBlogAdmin(
    @CurrentUser() currentUser: JwtDecode,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
    @Query('search') search?: string,
  ): Promise<ResponseBlog> {
    const response = new ResponseBlog();
    try {
      response.setSuccess(
        HttpStatus.OK,
        BlogMessage.allBlogSuccess,
        await this.blogService.getAllBlogAdmin(currentUser, limit, page, search),
      );
      return response;
    } catch (error) {
      response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
      return response;
    }
  }

  // lấy tất cả các blog đã accept
  @Get('getAllAccepted/admin')
  @HttpCode(200)
  @ApiOkResponse({
    type: () => ResponseBlog,
  })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  async getAllAcceptBlogAdmin(
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
  ): Promise<ResponseBlog> {
    const response = new ResponseBlog();
    try {
      response.setSuccess(
        HttpStatus.OK,
        BlogMessage.allBlogSuccess,
        await this.blogService.getAllAcceptBlogAdmin(limit, page),
      );
      return response;
    } catch (error) {
      response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
      return response;
    }
  }

  // lấy tất cả các blog chưa accept
  @Get('getAllUnaccepted/admin')
  @ApiBearerAuth('JWT-auth')
  @HttpCode(200)
  @UseGuards(AuthGuardUser)
  @ApiOkResponse({
    type: () => ResponseBlog,
  })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  async getAllUnacceptBlogAdmin(
    @CurrentUser() currentUser: JwtDecode,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
  ): Promise<ResponseBlog> {
    const response = new ResponseBlog();
    try {
      response.setSuccess(
        HttpStatus.OK,
        BlogMessage.allBlogSuccess,
        await this.blogService.getAllUnacceptBlogAdmin(currentUser, limit, page),
      );
      return response;
    } catch (error) {
      response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
      return response;
    }
  }

  // lấy tất cả các blog đã thuê
  @Get('getAllRented/admin')
  @ApiBearerAuth('JWT-auth')
  @HttpCode(200)
  @UseGuards(AuthGuardUser)
  @ApiOkResponse({
    type: () => ResponseBlog,
  })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  async getAllRentedBlogAdmin(
    @CurrentUser() currentUser: JwtDecode,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
  ): Promise<ResponseBlog> {
    const response = new ResponseBlog();
    try {
      response.setSuccess(
        HttpStatus.OK,
        BlogMessage.allBlogSuccess,
        await this.blogService.getAllRentedBlogAdmin(currentUser, limit, page),
      );
      return response;
    } catch (error) {
      response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
      return response;
    }
  }

  // lấy tất cả các blog chưa thuê
  @Get('getAllUnented/admin')
  @ApiBearerAuth('JWT-auth')
  @HttpCode(200)
  @UseGuards(AuthGuardUser)
  @ApiOkResponse({
    type: () => ResponseBlog,
  })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  async getAllUnRentedBlogAdmin(
    @CurrentUser() currentUser: JwtDecode,
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
  ): Promise<ResponseBlog> {
    const response = new ResponseBlog();
    try {
      response.setSuccess(
        HttpStatus.OK,
        BlogMessage.allBlogSuccess,
        await this.blogService.getAllUnRentedBlogAdmin(currentUser, limit, page),
      );
      return response;
    } catch (error) {
      response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
      return response;
    }
  }


  // lấy theo category blog được accept -- > hiển thị trang home
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
  async getAllBlogAccepted(
    @Param() body: { category: getAllDTO },
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
  ): Promise<ResponseBlog> {
    const response = new ResponseBlog();
    try {
      response.setSuccess(
        HttpStatus.OK,
        BlogMessage.allBlogSuccess,
        await this.blogService.getAllBlogAccepted(body.category, limit, page),
      );
      return response;
    } catch (error) {
      response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
      return response;
    }
  }

  // api tự hết thời gian của bài blog  
  @Put('hidden/:id')
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

  // edit blog  -> làm lại
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


  // chấp nhận blog bởi admin
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

  // từ chối blog bởi admin
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
    @Body() dto: ToggleBlockUserDTO
  ) {
    const response = new ResponseBlog();
    const { blockReason } = dto;
    try {
      const result = await this.blogService.declineBlog(id, currentUser, blockReason)
      return result;
    } catch (error) {
      response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
      return response;
    }
  }

  // Phòng này đã được thuê  chỉ có chủ trọ mới thao tác được
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

  // Bỏ phòng  đã được thuê  chỉ có chủ trọ mới thao tác được

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

  @Put('RentedRoomConfirm/:blogid/:renterid')
  @UseGuards(AuthGuardUser)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'blogid', description: 'ID of the blog' })
  @ApiParam({ name: 'renterid', description: 'ID of the blog' })
  async ConfirmUserRentRoom(
    @Param('blogid') id: string,
    @Param('renterid') renterId: string,
    @CurrentUser() currentUser: JwtDecode,
  ) {
    const response = new ResponseBlog();
    try {
      const result = await this.blogService.ConfirmUserRentRoom(id, renterId, currentUser)
      return result;
    }
    catch (error) {
      response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
      return response;
    }
  }

  // người cho thuê không xác nhận cho thuê
  @Put('RentedRoomUnConfirm/:blogid/:renterid')
  @UseGuards(AuthGuardUser)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'blogid', description: 'ID of the blog' })
  @ApiParam({ name: 'renterid', description: 'ID of the blog' })
  async LessorCancalUserRentRoom(
    @Param('blogid') id: string,
    @Param('renterid') renterId: string,
    @CurrentUser() currentUser: JwtDecode,
  ) {
    const response = new ResponseBlog();
    try {
      const result = await this.blogService.LessorCancalUserRentRoom(id, renterId, currentUser)
      return result;
    }
    catch (error) {
      response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
      return response;
    }
  }

  // người bỏ thuê phòng đang chờ confirm
  @Put('RentedUnrentRoom/:blogid')
  @UseGuards(AuthGuardUser)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'blogid', description: 'ID of the blog' })
  async RenterUnRentRoom(
    @Param('blogid') id: string,
    @CurrentUser() currentUser: JwtDecode,
  ) {
    const response = new ResponseBlog();
    try {
      const result = await this.blogService.RenterUnRentRoom(id, currentUser)
      return result;
    }
    catch (error) {
      response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
      return response;
    }
  }


  @Put('RentedRoom/:id')
  @UseGuards(AuthGuardUser)
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'id', description: 'ID of the blog' })


  async UserRentRoom(
    @Param('id') id: string,
    @CurrentUser() currentUser: JwtDecode,
  ) {
    const response = new ResponseBlog();
    try {
      const result = await this.blogService.UserRentRoom(id, currentUser)
      return result;
    }
    catch (error) {
      response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
      return response;
    }
  }

  // api search blog by price, area
  @Post('searchBlog/:category')
  @HttpCode(200)
  @ApiParam({
    name: 'category',
    description: 'Category of the blog',
    required: true,
  })
  @ApiOkResponse({
    type: () => ResponseBlog,
  })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'search', required: false })
  async searchBlog(
    @Body() body: searchBlogDTO,
    @Param() param: { category: getAllDTO },
    @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
    @Query('search') search?: string,
  ): Promise<ResponseBlog> {
    const response = new ResponseBlog();
    try {
      response.setSuccess(
        HttpStatus.OK,
        BlogMessage.allBlogSuccess,
        await this.blogService.searchBlog(param.category, body, limit, page, search),
      );
      return response;
    } catch (error) {
      response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
      return response;
    }
  }

  @Get('RentedBlogUser')
  @UseGuards(AuthGuardUser)
  @ApiBearerAuth('JWT-auth')
  async GetRoonRentedByUser(
    @CurrentUser() currentUser: JwtDecode,
  ) {
    const response = new ResponseBlog();
    try {
      const result = await this.blogService.GetRoonRentedByUser(currentUser)
      return result;
    }
    catch (error) {
      response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
      return response;
    }
  }

  // lấy ra phòng người dùng chờ xác nhận thuê
  @Get('ConfirmBlogUser')
  @UseGuards(AuthGuardUser)
  @ApiBearerAuth('JWT-auth')
  async GetRoomWaitingConfirmByUser(
    @CurrentUser() currentUser: JwtDecode,
  ) {
    const response = new ResponseBlog();
    try {
      const result = await this.blogService.GetRoomWaitingConfirmByUser(currentUser)
      return result;
    }
    catch (error) {
      response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
      return response;
    }
  }

  @Get('GetRoomLessorRentOut')
  @UseGuards(AuthGuardUser)
  @ApiBearerAuth('JWT-auth')
  async GetRoomLessorRentOut(
    @CurrentUser() currentUser: JwtDecode,
  ) {
    const response = new ResponseBlog();
    try {
      const result = await this.blogService.GetRoomLessorRentOut(currentUser)
      return result;
    }
    catch (error) {
      response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
      return response;
    }
  }

  // lấy ra phòng đã thuê của chủ trọ
  @Get('GetRentedRoomLessorRentOut')
  @UseGuards(AuthGuardUser)
  @ApiBearerAuth('JWT-auth')
  async GetRentedRoomLessorRentOut(
    @CurrentUser() currentUser: JwtDecode,
  ) {
    const response = new ResponseBlog();
    try {
      const result = await this.blogService.GetRentedRoomLessorRentOut(currentUser)
      return result;
    }
    catch (error) {
      response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
      return response;
    }
  }

  //lấy ra phòng chưa cho thuê của chủ trọ
  @Get('GetUnrentedRoomLessorRentOut')
  @UseGuards(AuthGuardUser)
  @ApiBearerAuth('JWT-auth')
  async GetUnrentedRoomLessorRentOut(
    @CurrentUser() currentUser: JwtDecode,
  ) {
    const response = new ResponseBlog();
    try {
      const result = await this.blogService.GetUnrentedRoomLessorRentOut(currentUser)
      return result;
    }
    catch (error) {
      response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
      return response;
    }
  }

  // tìm bạn cùng phòng
  @Get('GetRoomate')
  @UseGuards(AuthGuardUser)
  @ApiBearerAuth('JWT-auth')
  async getRoomate(
    @Param('blogid') blogId: string,
    @CurrentUser() currentUser: JwtDecode,
  ) {
    const response = new ResponseBlog();
    try {
      const result = await this.blogService.getRoomate(blogId, currentUser)
      return result;
    }
    catch (error) {
      response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
      return response;
    }
  }

  @Get('GuestBlog/:blogid')
  @UseGuards(AuthGuardUser)
  @ApiBearerAuth('JWT-auth')
  getFilteredBlogs(@Param('blogid') blogId: string) {
    return this.blogService.getFilteredBlogs(blogId);
  }


  @Get('weekly-post-count')
  @UseGuards(AuthGuardUser)
  @ApiBearerAuth('JWT-auth')
  async getWeeklyPostCount(@CurrentUser() currentUser: JwtDecode) {
    const weekPostCount = await this.blogService.getWeeklyPostCount(currentUser);
    return { weekPostCount };
  }

}
