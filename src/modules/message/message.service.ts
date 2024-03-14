/* eslint-disable prettier/prettier */
/* eslint-disable no-var */
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { Message } from "./schemas/message.schemas";
import { JwtDecode } from "../auth/types";

@Injectable({})
export class MessageService {
    constructor(
        @InjectModel(Message.name) private messageModel: Model<Message>,
    ) { }
    async createMessage(chat: Message): Promise<Message> {
        const newMessage = new this.messageModel(chat);
        return await newMessage.save();
    }

    // async getMessages(): Promise<Message[]> {
    //     return await this.messageModel.find();
    // }
    async getAllMessage(
        receiver_id: string,
        currentUser: JwtDecode,
        limit: number,
        page: number,
    ): Promise<any> {
        try {
            const messageList = await this.messageModel.find({
                $or: [
                    {
                        receiver_id: receiver_id,
                        sender_id: currentUser.id,
                    },
                    {
                        receiver_id: currentUser.id,
                        sender_id: receiver_id,
                    },
                ],
            })
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .populate([
                    { path: 'receiver_id', select: 'avatar fullName' },
                    { path: 'sender_id', select: 'avatar fullName' },
                ]);

            const total = await this.messageModel.countDocuments({
                $or: [
                    {
                        receiver_id: receiver_id,
                        sender_id: currentUser.id,
                    },
                    {
                        receiver_id: currentUser.id,
                        sender_id: receiver_id,
                    },
                ],
            });

            return {
                result: messageList,
                total,
            };
        } catch (error) {
            return error;
            // return res.status(500).json({ message: error.message });
        }
    }
}