/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type MessageDocument = HydratedDocument<Message>;
@Schema({ timestamps: true })
export class Message {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    sender_id: string
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    receiver_id: string
    @Prop()
    content: string;
    @Prop()
    image: string[];
    @Prop()
    video: string[];
    @Prop()
    file: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);