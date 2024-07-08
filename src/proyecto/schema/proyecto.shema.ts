import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema()
export class Proyecto extends Document {
  @Prop({ type: Number, required: true })
  fase_idFase: number;

  @Prop({ type: String, required: true })
  fecha_creacion: string;

  @Prop({ type: String, required: true })
  estado_idea: string;

  @Prop({ type: String, required: true })
  objetivos_especificos: string;

  @Prop({ type: String, required: true })
  objetivo_general: string;

  @Prop({ type: String, required: true })
  eje_estrategico: string;

  @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
  usuario_id_asignado: Types.ObjectId;
}

export const ProyectoSchema = SchemaFactory.createForClass(Proyecto);
