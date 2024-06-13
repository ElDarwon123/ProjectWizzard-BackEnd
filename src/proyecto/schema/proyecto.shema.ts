import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Proyecto extends Document {
  @Prop({ required: true })
  fase_idFase: number;

  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  fecha_creacion: string;

  @Prop({ required: true })
  estado_idea: string;

  @Prop({ required: true })
  objetivos_especificos: string;

  @Prop({ required: true })
  objetivo_general: string;

  @Prop({ required: true })
  eje_estrategico: string;

  @Prop({ required: true })
  estado: string;

  @Prop({ required: true })
  categoria_idCategoria: number;

  @Prop({ required: true })
  convocatoria_idConvocatoria: number;

  @Prop({ required: true })
  usuario_id_asignado: number;

  
}

export const ProyectoSchema = SchemaFactory.createForClass(Proyecto);