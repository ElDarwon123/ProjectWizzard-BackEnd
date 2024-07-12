import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { EstadoProyecto } from '../../enums/estado-proyecto.enum';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Proyecto extends Document {
  @ApiProperty()
  @Prop({ type: String, required: true })
  titulo: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  fecha: string;

  @ApiProperty()
  @Prop({
    type: String,
    enum: EstadoProyecto,
    default: EstadoProyecto.PENDIENTE,
  })
  estado: EstadoProyecto;

  @ApiProperty()
  @Prop({ type: String })
  descripcion?: string; // El campo descripcion es opcional (?)

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Usuario', required: true })
  usuarioId: string; // Agrega una referencia al usuario
}

export const ProyectoSchema = SchemaFactory.createForClass(Proyecto);
