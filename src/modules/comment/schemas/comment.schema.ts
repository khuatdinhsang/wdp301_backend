import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type CommentsDocument = HydratedDocument<Comments>;
@Schema()
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
}
export const CommentsSchema = SchemaFactory.createForClass(Comments);
