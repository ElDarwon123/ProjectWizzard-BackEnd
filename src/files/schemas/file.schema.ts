import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';


export type FileDocument = File & Document;

@Schema()
export class File {
  @ApiProperty()
  @Prop({ required: true })
  filename: string;

  @ApiProperty()
  @Prop({ required: true })
  path: string;

  @ApiProperty()
  @Prop({ required: true })
  mimetype: string;

  @ApiProperty()
  @Prop({ required: true })
  size: number;
}

export const FileSchema = SchemaFactory.createForClass(File);
