/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "src/modules/auth/schemas/user.schemas";

export type RoomDocument = HydratedDocument<Room>;
@Schema({ timestamps: true })
export class Room {
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
    users: User[]
    @Prop()
    lastMessage: string;
}

export const RoomSchema = SchemaFactory.createForClass(Room);