/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards, Param, Query, HttpException } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
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
@ApiTags('Auth')
@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) { }
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
            const fvrBlog = await this.authService.favoriteBlog({blogId: body.id }, currentUser);
            return  fvrBlog
        } catch (error) {
            response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
            return response;
        }
        
    }
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

    @Get('google/login')
    @UseGuards(GoogleAuthGuard)
    async googleAuth() { }

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

    // làm tiếp  getDetailUser,editUser, changePassword
    // getALLUsers --> admin có quyền truy cập, những role khác k có quyền 
    @UseGuards(AuthGuardUser)
    @ApiBearerAuth('JWT-auth')
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


    @UseGuards(AuthGuardUser)
    @ApiBearerAuth('JWT-auth')
    @Get('/getAllRenter/:page')
    async getAllRenters(@CurrentUser() currentUser: JwtDecode, @Query('page') page: number): Promise<User[]> {
        try {
            const isAdmin = currentUser.role === 'admin';
            if (!isAdmin) {
                throw new Error(UserMessage.isNotAdmin);
            }

            const renters = await this.authService.getAllRenters(page);
            return renters;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @UseGuards(AuthGuardUser)
    @ApiBearerAuth('JWT-auth')
    @Get('/getAllUsers/:page')
    async getAllUsers(@CurrentUser() currentUser: JwtDecode, @Query('page') page: number): Promise<User[]> {
        try {
            const isAdmin = currentUser.role === 'admin';
            if (!isAdmin) {
                throw new Error(UserMessage.isNotAdmin);
            }

            const renters = await this.authService.getAllUsers(page);
            return renters;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @UseGuards(AuthGuardUser)
    @ApiBearerAuth('JWT-auth')
    @Post(':userId/toggleBlock')
    async toggleBlockUser(@Param('userId') userId: string, @CurrentUser() currentUser: JwtDecode): Promise<ResponseToggleBlockUser> {
        const response = new ResponseToggleBlockUser();

        try {
            const isAdmin = currentUser.role === 'admin';
            if (!isAdmin) {
                throw new Error(UserMessage.isNotAdmin)
            }

            const result = await this.authService.toggleBlockUser(userId);
            if ('status' in result) {
                response.setError(result.status, result.message);
                return response;
            } else {
                const response = new ResponseToggleBlockUser();
                response.isSuccess = true;
                response.statusCode = HttpStatus.OK;
                response.message = UserMessage.toggleBlockUserSuccessfully;
                response.user = result;
                return response;
            }
        } catch (error) {
            response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
            return response;
        }
    }
    @UseGuards(AuthGuardUser)
    @ApiBearerAuth('JWT-auth')
    @Get('/getAllLessors/:page')
    async getAllLessors(@CurrentUser() currentUser: JwtDecode, @Query('page') page: number): Promise<User[]> {
        try {
            const isAdmin = currentUser.role === 'admin';
            if (!isAdmin) {
                throw new Error(UserMessage.isNotAdmin);
            }
            const renters = await this.authService.getAllLessors(page);
            return renters;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @UseGuards(AuthGuardUser)
    @ApiBearerAuth('JWT-auth')
    @Get('/getAllBlogsPost/:page')
    async getAllBlogPostByUser(@Query('page') page: number, @CurrentUser() currentUser: JwtDecode): Promise<Blog[]> {
        try {
            const blogPosts = await this.authService.getAllBlogPostByUserId(currentUser.id, page);
            return blogPosts;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}