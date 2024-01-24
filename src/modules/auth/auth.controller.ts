/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { UserMessage } from "src/enums";
import { LoginDTO, editProfileDTO, ResponseRegister, ResponseProfileDetail, registerDTO, ResponseLogin, refreshTokenDTO, ResponseRefreshToken, ResponseFavoriteBlog } from "./dto";
import { CurrentUser } from "./decorator/user.decorator";
import { User } from "./schemas/user.schemas";
import { AuthGuard } from "./auth.guard";
import { JwtDecode } from "./types";
import { detailBlogDTO } from "../blog/dto";
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
    @UseGuards(AuthGuard)
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
    @UseGuards(AuthGuard)
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

    // làm tiếp  getDetailUser,editUser, changePassword
    // getALLUsers --> admin có quyền truy cập, những role khác k có quyền 
    @UseGuards(AuthGuard)
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
}

