/* eslint-disable prettier/prettier */

import { Body, Controller, Get, HttpCode, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { RoomService } from './room.service';
import { AuthGuardUser } from "../auth/auth.guard";
import { CurrentUser } from "../auth/decorator/user.decorator";
import { JwtDecode } from "../auth/types";
import { ChatRoomDto } from "./dto/room.dto";

@ApiTags('Room')
@Controller('room')
export class RoomController {
    constructor(private roomService: RoomService) { }

    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuardUser)
    @HttpCode(200)
    @Get('get-all')
    async getAllChatRoom(@CurrentUser() currentUser: JwtDecode): Promise<any> {
        try {
            const data = await this.roomService.getAllChatRoom(currentUser);
            return data
        } catch (error) {
            console.log("error", error)
            // response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
        }
    }
    @ApiBearerAuth('JWT-auth')
    @UseGuards(AuthGuardUser)
    @HttpCode(200)
    @Get('get-one/:id')
    async getOneChatRoom(
        @Param('id') id: string,
    ): Promise<any> {
        try {
            const data = await this.roomService.getOneChatRoom(id);
            return data
        } catch (error) {
            console.log("error", error)
            // response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
        }
    }
    @Post('create')
    @HttpCode(200)
    @UseGuards(AuthGuardUser)
    @ApiBearerAuth('JWT-auth')
    async create(
        @Body() payload: ChatRoomDto,
    ): Promise<any> {
        try {
            const data = await this.roomService.createChatRoom(payload);
            return data
        } catch (error) {
            console.log("error", error)
            // response.setError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);
        }
    }

}
