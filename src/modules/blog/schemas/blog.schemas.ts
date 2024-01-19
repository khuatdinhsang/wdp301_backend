/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { CategoryRoom, HasTagRoom, RentalObject } from "src/enums";

export type BlogDocument = HydratedDocument<Blog>;
@Schema()
export class Blog {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    userId: string
    @Prop({ type: String, required: true })
    category: CategoryRoom
    @Prop({ type: String, required: true })
    hasTag: HasTagRoom;
    @Prop({ required: true })
    title: string;
    @Prop({ required: true })
    description: string;
    @Prop()
    area: number;
    @Prop()
    money: number
    @Prop({ type: [String] })
    image: string[];
    @Prop({ type: [String] })
    video: string[];
    @Prop({ default: 'Hà nội' })
    province: string
    @Prop({ default: 'Thạch thất' })
    district: string
    @Prop({ default: 'Hòa Lạc' })
    ward: string
    @Prop()
    addressDetail: string
    @Prop({ default: 1 })
    totalRoom: number
    @Prop({ default: 0 })
    totalFavorite: number
    @Prop({ type: String, required: true, default: RentalObject.BOTH })
    rentalObject: RentalObject
    @Prop({ default: false })
    isAccepted: boolean
    @Prop({ type: Date, required: true })
    expiredTime: Date
    @Prop({ default: false })
    isHide: boolean
    @Prop()
    star: number
    @Prop({ default: false })
    isRented: boolean
}
export const BlogSchema = SchemaFactory.createForClass(Blog);