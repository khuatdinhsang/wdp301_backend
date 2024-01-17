/* eslint-disable prettier/prettier */
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { UserMessage } from "src/enums";
import { LoginDTO, ResponseRegister, registerDTO, ResponseLogin } from "./dto";
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


}

