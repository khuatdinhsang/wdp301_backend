import { Prop,Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, ObjectId } from "mongoose";
import { Blog } from "src/modules/blog/schemas/blog.schemas";

export type BlogDocument = HydratedDocument<Blog_Rate>;
@Schema()
export class Blog_Rate{
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    userId: string
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true })
    blogId: string
    @Prop({required: true })
    star: number
    @Prop()
    title: string;
}
export const BlogRateSchema = SchemaFactory.createForClass(Blog_Rate);