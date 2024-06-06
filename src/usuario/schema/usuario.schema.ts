import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Role } from 'src/role/schema/role.schema';

@Schema()
export class Usuario extends Document {
  @Prop({ required: true })
  nombre: string;
  @Prop({ required: true })
  apellido: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  numIdentificacion: string;
  @Prop()
  telefono: string;
  @Prop({ default: Date.now() })
  fechaNacimieto: Date;
  @Prop()
  caracterizacion: string;
  @Prop()
  contrasena: string;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Role' })
  role: Role;
}

export const usuarioSchema = SchemaFactory.createForClass(Usuario);
