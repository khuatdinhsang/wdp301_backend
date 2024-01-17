/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory, raw } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { UserRole } from "src/enums/role.enum";
import { Blog } from "src/modules/blog/schemas/blog.schemas";

export type AccountDocument = HydratedDocument<User>;
@Schema()
export class User {
    @Prop({ required: true })
    fullName: string
    email: string;
    @Prop({ required: true })
    password: string;
    @Prop()
    avatar: string;
    @Prop()
    dateOfBirth: Date;
    @Prop()
    gender: boolean;
    @Prop({ required: true })
    phone: string;
    @Prop()
    address: string;
    @Prop(raw({
        isBlock: { type: Boolean, default: false },
        content: String,
        day: Date
    }))
    block: Record<string, any>;
    @Prop()
    refreshToken: string
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }] })
    blogsPost: Blog[]
    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }] })
    blogsFavourite: Blog[]
    @Prop({ type: String, required: true })
    role: UserRole
}

export const UserSchema = SchemaFactory.createForClass(User);