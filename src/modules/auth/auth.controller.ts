/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards, Param, Query, HttpException, ParseIntPipe } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiQuery, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { UserMessage } from "src/enums";
import { LoginDTO, editProfileDTO, ResponseRegister, ResponseProfileDetail, ResponseChangePassword, registerDTO, ResponseLogin, refreshTokenDTO, ResponseRefreshToken, ResponseFavoriteBlog, ChangePasswordDTO, ResponseToggleBlockUser } from "./dto";
import { CurrentUser } from "./decorator/user.decorator";
import { AuthGuardUser } from "./auth.guard";
import { JwtDecode } from "./types";
import { detailBlogDTO } from "../blog/dto";
import { GoogleAuthGuard } from "./google.guard";
import { FacebookAuthGuard } from "./facebook.guard";
import { User } from "./schemas/user.schemas";
import { Blog } from "../blog/schemas/blog.schemas";
import { ToggleBlockUserDTO } from "./dto/toggleBlockUser.dto";
@ApiTags('Auth')
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) { }
    // đăng kí bằng số điện thoại
    @Post('register')
    @HttpCode(200)
    @ApiOkResponse({
        type: () => ResponseRegister,
    })
    async register(@Body() body: registerDTO): Promise<ResponseRegister> {
        const response = new ResponseRegister()
        try {
            response.setSuccess(HttpStatus.OK, UserMessage.registerSuccess, await this.authService.register(body))
            return response
        } catch (error) {
            response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message)
            return response
        }
    }

    // login bằng sdt và mk
    @Post('login')
    @HttpCode(200)
    @ApiOkResponse({
        type: () => ResponseLogin,
    })
    async login(@Body() body: LoginDTO): Promise<ResponseLogin> {
        const response = new ResponseLogin()
        try {
            response.setSuccess(HttpStatus.OK, UserMessage.loginSuccess, await this.authService.login(body))
            return response
        } catch (error) {
            response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message)
            return response
        }
    }
    // refreshtoken bên front-end
    @Post('refreshToken')
    @HttpCode(200)
    @ApiOkResponse({
        type: () => ResponseRefreshToken,
    })
    async refreshToken(@Body() body: refreshTokenDTO): Promise<ResponseRefreshToken> {
        const response = new ResponseRefreshToken()
        try {
            response.setSuccess(HttpStatus.OK, UserMessage.refreshTokenSuccess, await this.authService.refreshToken(body))
            return response
        } catch (error) {
            response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message)
            return response
        }
    }

    // cho user yêu thích các blog
    @Post('blog/favorite')
    @HttpCode(200)
    @UseGuards(AuthGuardUser)
    @ApiBearerAuth('JWT-auth')
    @ApiOkResponse({
        type: () => ResponseFavoriteBlog,
    })
    async favoriteBlog(@Body() body: detailBlogDTO, @CurrentUser() currentUser: JwtDecode) {
        const response = new ResponseFavoriteBlog();
        try {
            const fvrBlog = await this.authService.favoriteBlog({ blogId: body.id }, currentUser);
            return fvrBlog
        } catch (error) {
            response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
            return response;
        }

    }

    // cho user chỉnh sửa thông tin cá nhân
    @Post('editProfile')
    @UseGuards(AuthGuardUser)
    @ApiBearerAuth('JWT-auth')
    @HttpCode(200)
    @ApiOkResponse({
        type: () => ResponseLogin,
    })
    async editProfile(@Body() body: editProfileDTO, @CurrentUser() currentUser: JwtDecode): Promise<any> {
        const response = new ResponseLogin();
        try {
            const updatedUser = await this.authService.editUserProfile(currentUser.id, body);
            return updatedUser;
        } catch (error) {
            if (error.message === UserMessage.phoneExist) {
                response.setError(HttpStatus.BAD_REQUEST, UserMessage.phoneExist);
            } else {
                console.log(error.message);

                response.setError(HttpStatus.INTERNAL_SERVER_ERROR, UserMessage.editUserProfileFail);
            }
            return response;
        }
    }
    // login GG
    @Get('google/login')
    @UseGuards(GoogleAuthGuard)
    async googleAuth(@Req() req) {
        console.log(req)
    }

    @Get('google/callback')
    @UseGuards(GoogleAuthGuard)
    async googleAuthRedirect(@Req() req: any): Promise<ResponseLogin> {
        const response = new ResponseLogin()
        try {
            response.setSuccess(HttpStatus.OK, UserMessage.loginSuccess, req.user)
        } catch (error) {
            response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message)
        }
        return response
    }
    // login Facebook
    @Get('facebook/login')
    @UseGuards(FacebookAuthGuard)
    async facebookAuth() { }

    @Get('facebook/callback')
    @UseGuards(FacebookAuthGuard)
    async facebookAuthRedirect(@Req() req: any): Promise<ResponseLogin> {
        const response = new ResponseLogin()
        try {
            response.setSuccess(HttpStatus.OK, UserMessage.loginSuccess, req.user)
        } catch (error) {
            response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message)
        }
        return response
    }

    // view profile, người khác cũng có thể xem được trang cá nhân của mình

    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuardUser)
    @Get('profile')
    async profileDetail(@CurrentUser() currentUser: JwtDecode): Promise<ResponseProfileDetail> {
        const response = new ResponseProfileDetail();

        try {
            const userProfile = await this.authService.profileDetail(currentUser.id);
            response.setSuccess(HttpStatus.OK, UserMessage.profileDetailSuccess, userProfile);
        } catch (error) {
            response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
        }

        return response;
    }
    // user thay đổi mật khẩu
    @UseGuards(AuthGuardUser)
    @ApiBearerAuth('JWT-auth')
    @Post('changePassword')
    async changePassword(
        @CurrentUser() currentUser: JwtDecode,
        @Body() changePasswordDto: ChangePasswordDTO
    ): Promise<ResponseChangePassword> {
        try {
            const result = await this.authService.changePassword(currentUser.id, changePasswordDto);

            const response: ResponseChangePassword = new ResponseChangePassword();
            response.isSuccess = true;
            response.statusCode = HttpStatus.OK;
            response.message = result.message;
            // Kiểm tra nếu có user được trả về từ service, thêm user vào response
            if (result.user) {
                response.user = result.user;
            }
            return response;
        } catch (error) {
            const response: ResponseChangePassword = new ResponseChangePassword();
            response.setError(HttpStatus.INTERNAL_SERVER_ERROR, UserMessage.changePasswordFail);
            return response;
        }
    }


    // get All role rented bởi admin
    @UseGuards(AuthGuardUser)
    @ApiBearerAuth('JWT-auth')
    @Get('/getAllRenter')
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'search', required: false })
    async getAllRenters(@CurrentUser() currentUser: JwtDecode,
        @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
        @Query('page', new ParseIntPipe({ optional: true })) page: number,
        @Query('search') search?: string,
    ): Promise<User[]> {
        try {
            const isAdmin = currentUser.role === 'admin';
            if (!isAdmin) {
                throw new Error(UserMessage.isNotAdmin);
            }

            const renters = await this.authService.getAllRenters(limit, page, search);
            return renters;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // get tất cả người dùng (renter, lessor) bởi admin
    @UseGuards(AuthGuardUser)
    @ApiBearerAuth('JWT-auth')
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'search', required: false })
    @Get('/getAllUsers')
    async getAllUsers(@CurrentUser() currentUser: JwtDecode,
        @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
        @Query('page', new ParseIntPipe({ optional: true })) page: number,
        @Query('search') search?: string,
    ): Promise<User[]> {
        try {
            const isAdmin = currentUser.role === 'admin';
            if (!isAdmin) {
                throw new Error(UserMessage.isNotAdmin);
            }

            const renters = await this.authService.getAllUsers(limit, page, search);
            return renters;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    // block user by admin ---> chưa xong 
    @UseGuards(AuthGuardUser)
    @ApiBearerAuth('JWT-auth')
    @Post(':userId/toggleBlock')
    async toggleBlockUser(@Param('userId') userId: string, @Body() dto: ToggleBlockUserDTO): Promise<ResponseToggleBlockUser> {
        const response = new ResponseToggleBlockUser();
        try {
            const { blockReason } = dto;
            const result = await this.authService.toggleBlockUser(userId, blockReason);
            if ('status' in result) {
                response.setError(result.status, result.message);
            } else {
                response.isSuccess = true;
                response.statusCode = HttpStatus.OK;
                response.message = UserMessage.toggleBlockUserSuccessfully;
                response.user = result;
            }
        } catch (error) {
            response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
        }

        return response;
    }

    // get all Lessor by admin 
    @UseGuards(AuthGuardUser)
    @ApiBearerAuth('JWT-auth')
    @Get('/getAllLessors')
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'search', required: false })
    async getAllLessors(@CurrentUser() currentUser: JwtDecode,
        @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
        @Query('page', new ParseIntPipe({ optional: true })) page: number,
        @Query('search') search?: string,

    ): Promise<User[]> {
        try {
            const isAdmin = currentUser.role === 'admin';
            if (!isAdmin) {
                throw new Error(UserMessage.isNotAdmin);
            }
            const renters = await this.authService.getAllLessors(limit, page, search);
            return renters;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // lấy tất cả các bài đăng của user 
    @UseGuards(AuthGuardUser)
    @ApiBearerAuth('JWT-auth')
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'search', required: false })
    @Get('/getAllBlogsPost')
    async getAllBlogPostByUser(@CurrentUser() currentUser: JwtDecode,
        @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
        @Query('page', new ParseIntPipe({ optional: true })) page: number,
        @Query('search') search?: string,
    ): Promise<Blog[]> {
        try {
            const blogPosts = await this.authService.getAllBlogPostByUserId(currentUser.id, limit, page, search);
            return blogPosts;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // lấy tất cả các bài viết yêu thích của user
    @UseGuards(AuthGuardUser)
    @ApiBearerAuth('JWT-auth')
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'page', required: false })
    @Get('/getAllFavoriteBlogs')
    async getAllFavouriteBlogsByUser(
        @CurrentUser() currentUser: JwtDecode,
        @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
        @Query('page', new ParseIntPipe({ optional: true })) page: number,
    ): Promise<Blog[]> {
        try {
            const favoriteBlog = await this.authService.getAllFavouriteBlogsByUserId(currentUser.id, limit, page);
            return favoriteBlog;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}