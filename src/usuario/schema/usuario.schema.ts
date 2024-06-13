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

  @Prop({
    set: (value: string) => bcrypt.hashSync(value, 10),
  })
  contrasena: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Role' })
  role: Role;

  comparePassword: (password: string) => Promise<boolean>;
}

export const usuarioSchema = SchemaFactory.createForClass(Usuario);
usuarioSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.contrasena);
};
