import { ApiProperty } from "@nestjs/swagger";
import { Document, Schema } from "mongoose";

export class Auth { }

export const BlackListSchema = new Schema({
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '5h'}
})


export class BlackList extends Document{
    @ApiProperty()
    token: string;
    @ApiProperty()
    createdAt: Date;
}