// proyectos/proyecto.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EstadoProyecto } from '../../enums/estado-proyecto.enum';

@Schema()
export class Proyecto extends Document {
  @Prop({ type: String, required: true })
  titulo: string;

  @Prop({ type: String, required: true })
  fecha: string;

  @Prop({ type: String, enum: EstadoProyecto, default: EstadoProyecto.PENDIENTE })
  estado: EstadoProyecto;
}

export const ProyectoSchema = SchemaFactory.createForClass(Proyecto);
