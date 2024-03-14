/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory, raw } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { UserRole } from "src/enums/role.enum";
import { Blog } from "src/modules/blog/schemas/blog.schemas";

export type AccountDocument = HydratedDocument<User>;
@Schema()
export class User {
    @Prop()
    fullName: string
    @Prop()
    email: string;
    @Prop()
    password: string;
    @Prop()
    avatar: string;
    @Prop()
    dateOfBirth: Date;
    @Prop()
    gender: boolean;
    @Prop()
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
    blogsFavorite: Blog[]
    @Prop({ type: String })
    role: UserRole
    @Prop()
    idFacebook: string
    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ type: Date, default: Date.now })
    updatedAt: Date;

}

export const UserSchema = SchemaFactory.createForClass(User);