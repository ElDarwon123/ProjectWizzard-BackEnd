import { Prop } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import { Document, Schema } from "mongoose";

export class Auth { }

export const BlackListSchema = new Schema({
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '5h'}
})


export class BlackList extends Document{
    @ApiProperty()
    @Prop({ required: true })
    token: string;
    @ApiProperty()
    @Prop({ default: Date.now })
    createdAt: Date;
}