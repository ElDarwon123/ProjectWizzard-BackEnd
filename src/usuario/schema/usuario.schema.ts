import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { ApiProperty } from '@nestjs/swagger';
@Schema()
export class Usuario extends Document {
  @ApiProperty()
  @Prop({ required: true })
  nombre: string;

  @ApiProperty()
  @Prop({ required: true })
  apellido: string;

  @ApiProperty()
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty()
  @Prop({ required: true })
  numIdentificacion: string;

  @ApiProperty()
  @Prop()
  telefono: string;

  @ApiProperty()
  @Prop({ type: Date })
  fechaNacimieto: Date;

  @ApiProperty()
  @Prop()
  caracterizacion: string;

  @ApiProperty()
  @Prop({
    set: (value: string) => bcrypt.hashSync(value, 10),
  })
  contrasena: string;

  @ApiProperty()
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
