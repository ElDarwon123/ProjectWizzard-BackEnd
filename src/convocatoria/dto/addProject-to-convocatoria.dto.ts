import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsUUID } from "class-validator";
import { ObjectId } from "mongoose";

export class AddProjToAnnouncementDto {
    @ApiProperty({example: '66da09113e70ed34c1368824'})
    @IsMongoId()
    @IsNotEmpty()
    proyecto: ObjectId;

}