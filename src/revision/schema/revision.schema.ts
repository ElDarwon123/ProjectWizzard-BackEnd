import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Seccion } from 'src/seccion/schema/seccion.schema';
import { Usuario } from 'src/usuario/schema/usuario.schema';

@Schema()
export class Revision extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' })
  usuario: Usuario;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Seccion' })
  seccion: Seccion;
  @Prop()
  estado: String;
  @Prop({ type: String, required: true })
  sugerencia: String;
  @Prop({ type: String, required: true })
  descripcion: String;
  @Prop({ default: Date.now })
  fechaRevision: String;
}

export const revisionSchema = SchemaFactory.createForClass(Revision);
