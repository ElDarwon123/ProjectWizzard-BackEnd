import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { Seccion } from 'src/seccion/schema/seccion.schema';
import { Usuario } from 'src/usuario/schema/usuario.schema';

@Schema()
export class Revision extends Document {
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' })
  usuario: Usuario;
  @ApiProperty()
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Seccion' })
  seccion: Seccion;
  @ApiProperty()
  @Prop()
  estado: String;
  @ApiProperty()
  @Prop({ type: String, required: true })
  sugerencia: String;
  @ApiProperty()
  @Prop({ type: String, required: true })
  descripcion: String;
  @ApiProperty()
  @Prop({ default: Date.now })
  fechaRevision: String;
}

export const revisionSchema = SchemaFactory.createForClass(Revision);
