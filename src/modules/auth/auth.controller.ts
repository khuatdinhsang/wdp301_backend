/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { UserMessage } from "src/enums";
import { LoginDTO, editProfileDTO, ResponseRegister, ResponseProfileDetail, ResponseChangePassword,  registerDTO, ResponseLogin, refreshTokenDTO, ResponseRefreshToken, ResponseFavoriteBlog, ChangePasswordDTO } from "./dto";
import { CurrentUser } from "./decorator/user.decorator";
import { AuthGuardUser } from "./auth.guard";
import { JwtDecode } from "./types";
import { detailBlogDTO } from "../blog/dto";
import { GoogleAuthGuard } from "./google.guard";
import { FacebookAuthGuard } from "./facebook.guard";
import { User } from "./schemas/user.schemas";
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
    async favoriteBlog(@Body() body: detailBlogDTO, @CurrentUser() currentUser: JwtDecode): Promise<any> {
        const response = new ResponseFavoriteBlog()
        try {
            response.setSuccess(HttpStatus.OK, UserMessage.favoriteBlogSuccess, await this.authService.favoriteBlog(body, currentUser))
            return response
        } catch (error) {
            response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message)
            return response
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
            return response;
        } catch (error) {
            response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
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
    async changePassword(@CurrentUser() currentUser: JwtDecode, @Body() changePasswordDto: ChangePasswordDTO): Promise<ResponseChangePassword> {
        try {
            const success = await this.authService.changePassword(currentUser.id, changePasswordDto);
            if (!success) {
                const response: ResponseChangePassword = new ResponseChangePassword();
                response.setError(HttpStatus.BAD_REQUEST, UserMessage.changePasswordFail);
                return response;
            }

            const response: ResponseChangePassword = new ResponseChangePassword();
            response.isSuccess = true;
            response.statusCode = HttpStatus.OK;
            response.message = UserMessage.changePasswordSuccess;
            return response;
        } catch (error) {
            console.error(error);
            throw new Error(UserMessage.changePasswordFail);
        }
    }

    @UseGuards(AuthGuardUser)
    @ApiBearerAuth('JWT-auth')
    @Get('getAllRenter')
    async getAllRenters(@CurrentUser() currentUser: JwtDecode): Promise<User[]> {
        const isAdmin = currentUser.role === 'admin';
        if (!isAdmin) {
            throw new Error(UserMessage.isNotAdmin)
        }
        return this.authService.getAllRenters();
    }
}