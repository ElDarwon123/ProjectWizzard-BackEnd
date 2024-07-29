import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as MongooseSchema, ObjectId } from 'mongoose';
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
  descripcion?: string; 

  @ApiProperty()
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Usuario', required: true })
  usuarioId: string; 

  @ApiProperty()
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Seccion', required: true })
  secciones: string[];
}

export const ProyectoSchema = SchemaFactory.createForClass(Proyecto);
