import { Prop,Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type BlogDocument = HydratedDocument<Comments>;
@Schema()
export class Comments{
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Blog_Rate', required: true })
    feedbackid: string
    @Prop({ required: true })
    content: string
    @Prop()
    image: string;
}
export const commentsSchema = SchemaFactory.createForClass(Comments);