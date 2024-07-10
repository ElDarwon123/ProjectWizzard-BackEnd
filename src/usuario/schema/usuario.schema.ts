import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Role } from 'src/role/schema/role.schema';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
@Schema()
export class Usuario extends Document {
  @Prop({ required: true })
  nombre: string;

  @Prop({ required: true })
  apellido: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  numIdentificacion: string;

  @Prop()
  telefono: string;

  @Prop({ default: Date.now() })
  fechaNacimieto: Date;

  @Prop()
  caracterizacion: string;

  @Prop({
    set: (value: string) => bcrypt.hashSync(value, 10),
  })
  contrasena: string;

  @Prop({ required: true })
  role: string;
}

export const usuarioSchema = SchemaFactory.createForClass(Usuario);

usuarioSchema.pre<Usuario>('save', async function (next) {
  if (this.isModified('password')) {
    this.contrasena = await bcrypt.hash(this.contrasena, 10);
  }
  next();
});
