/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type BlogDocument = HydratedDocument<Blog_Rate>;
@Schema({ timestamps: true })
export class Blog_Rate {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true })
  blogId: string;
  @Prop({ required: true })
  star: number;
  @Prop()
  title: string;
  @Prop()
  fullname: string;
  @Prop()
  avt: string;
  @Prop()
  time: Date;
  @Prop()
  file: string[];
  // @Prop({ type: Date, default: Date.now })
  // createdAt: Date;

  // @Prop({ type: Date, default: Date.now })
  // updatedAt: Date;
}
export const BlogRateSchema = SchemaFactory.createForClass(Blog_Rate);
