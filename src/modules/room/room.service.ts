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
                lastMessage: 1,
            },
        )
            .sort({ updatedAt: -1 })
            .populate('users', '_id fullName avatar role');
        return chatRoomList;
    }
    async getOneChatRoom(chat_room_id: string) {
        const chatRoomDetail = await this.roomModel.findOne({
            _id: chat_room_id,
        }).populate('users', '_id fullName avatar role');
        return chatRoomDetail;
    }
    async createChatRoom(payload: ChatRoomDto) {
        const allRoom = await this.roomModel.find()
        let check = false;
        for (const room of allRoom) {
            let foundUsers = 0;
            for (const user of payload.users) {
                if (room.users.includes(user)) {
                    foundUsers++;
                }
            }
            if (foundUsers === payload.users.length) {
                check = true
                // Cả hai người dùng đều tồn tại trong ít nhất một phòng
            }
        }
        if (!check) {
            const chatRoom = await this.roomModel.create({
                ...payload,
            });
            return chatRoom;
        }
        const room = await this.roomModel.findOne({ users: payload.users })
        return room
    }
    async updateChatRoomService({
        sender_id,
        receiver_id,
        lastMessage,
    }) {
        try {
            await this.roomModel.findOneAndUpdate(
                {
                    users: { $all: [sender_id, receiver_id] },
                },
                { lastMessage },
            );
        } catch (error) {
            console.log('error', error);
        }
    }

}