/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type CommentsDocument = HydratedDocument<Comments>;
@Schema({ timestamps: true })
export class Comments {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Blog_Rate', required: true })
  feedbackId: string;
  @Prop({ required: true })
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
export const CommentsSchema = SchemaFactory.createForClass(Comments);
