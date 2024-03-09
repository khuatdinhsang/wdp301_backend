/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type AccountDocument = HydratedDocument<Transaction>;
@Schema({ timestamps: true })
export class Transaction {
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    userId: string
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'BLog', required: true })
    blogId: string
    @Prop()
    totalMoney: number;
    @Prop({ type: Date, default: Date.now })
    createdAt: Date;
    // @Prop({ type: Date, default: Date.now })
    // updatedAt: Date;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);