import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { EstadoProyecto } from '../../enums/estado-proyecto.enum';

@Schema()
export class Proyecto extends Document {
  @Prop({ type: String, required: true })
  titulo: string;

  @Prop({ type: String, required: true })
  fecha: string;

  @Prop({ type: String, enum: EstadoProyecto, default: EstadoProyecto.PENDIENTE })
  estado: EstadoProyecto;

  @Prop({ type: String })
  descripcion?: string; // El campo descripcion es opcional (?)

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Usuario', required: true })
  usuarioId: string; // Agrega una referencia al usuario
}

export const ProyectoSchema = SchemaFactory.createForClass(Proyecto);
