/* eslint-disable prettier/prettier */

import { Controller, Get, HttpCode, Param, ParseIntPipe, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { MessageService } from "./message.service";
import { AuthGuardUser } from "../auth/auth.guard";
import { CurrentUser } from "../auth/decorator/user.decorator";
import { JwtDecode } from "../auth/types";

@ApiTags('Message')
@Controller('message')
export class MessageController {
    constructor(private messageService: MessageService) {
    }
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuardUser)
    @HttpCode(200)
    @Get('get-all/:receiver_id')
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'page', required: false })
    async getAllMessage(
        @Param('receiver_id') receiver_id: string,
        @CurrentUser() currentUser: JwtDecode,
        @Query('limit', new ParseIntPipe({ optional: true })) limit: number,
        @Query('page', new ParseIntPipe({ optional: true })) page: number,
    ): Promise<any> {
        try {
            const data = await this.messageService.getAllMessage(receiver_id, currentUser, limit, page);
            console.log("da", data)
            return data
        } catch (error) {
            console.log("error", error)
            // response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
        }
    }
}
