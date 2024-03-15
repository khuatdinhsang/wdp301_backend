/* eslint-disable prettier/prettier */
/* eslint-disable no-var */
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { Room } from "./schemas/room.schemas";
import { JwtDecode } from "../auth/types";
import { ChatRoomDto } from "./dto/room.dto";

@Injectable({})
export class RoomService {
    constructor(
        @InjectModel(Room.name) private roomModel: Model<Room>,
    ) { }

    async getAllChatRoom(currentUser: JwtDecode) {
        const chatRoomList = await this.roomModel.find(
            {
                users: { $in: currentUser.id },
            },
            {
                users: {
                    $elemMatch: {
                        $ne: currentUser.id,
                    },
                },
                updatedAt: 1,
                last_message: 1,
            },
        )
            .sort({ updatedAt: -1 })
            .populate('users', '_id fullName avatar');
        return chatRoomList;
    }
    async getOneChatRoom(chat_room_id: string) {
        const chatRoomDetail = await this.roomModel.findOne({
            _id: chat_room_id,
        }).populate('users', '_id fullName avatar');
        return chatRoomDetail;
    }
    async createChatRoom(payload: ChatRoomDto) {
        const chatRoom = await this.roomModel.create({
            ...payload,
        });
        return chatRoom;
    }
}