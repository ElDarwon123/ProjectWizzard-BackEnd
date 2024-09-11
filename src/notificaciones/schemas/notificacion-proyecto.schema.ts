import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Types } from 'mongoose';
import { notiStateEnum } from 'src/enums/estado-noti.enum';
import { Proyecto } from 'src/proyecto/schema/proyecto.shema';

@Schema({ timestamps: true })
export class NotificacionProyecto {
  @ApiProperty()
  @Prop()
  title: string;
  @ApiProperty()
  @Prop()
  body: string;
  @ApiProperty()
  @Prop()
  url: string;
  @ApiProperty()
  @Prop({ enum: notiStateEnum, default: notiStateEnum.NonViwed })
  estado: notiStateEnum.NonViwed;
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Proyecto' })
  proyecto: Proyecto;
}

export const notiProjectSchema =
  SchemaFactory.createForClass(NotificacionProyecto);
