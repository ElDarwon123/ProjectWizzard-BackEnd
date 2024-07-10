import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Proyecto } from '../../proyecto/schema/proyecto.shema';
import * as mongoose from 'mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Seccion extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Proyecto' })
  proyecto: Proyecto;

  @Prop({ required: true })
  tipoSeccion: String;

  @Prop({ default: Date.now })
  fechaCreacion: Date;
}

export const seccionSchema = SchemaFactory.createForClass(Seccion);
