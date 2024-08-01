import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { ApiProperty } from '@nestjs/swagger';
import { RolesEnum } from 'src/enums/role.enum';
import { Proyecto } from 'src/proyecto/schema/proyecto.shema';

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
  @Prop({
    required: true,
    set: (value: string) => new Date(value),
  })
  fechaNacimiento: Date;

  @ApiProperty()
  @Prop()
  caracterizacion: string;

  @ApiProperty()
  @Prop({
    set: (value: string) => bcrypt.hashSync(value, 10),
  })
  contrasena: string;

  @ApiProperty()
  @Prop({ required: true, enum: RolesEnum })
  role: RolesEnum;

  @ApiProperty()
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Proyecto' })
  proyectos: ObjectId[];

  @ApiProperty()
  @Prop({ type: String })
  icon: string
}

export const usuarioSchema = SchemaFactory.createForClass(Usuario);

// usuarioSchema.pre<Usuario>('save', async function (next) {
//   if (this.isModified('contrasena')) {
//     this.contrasena = await bcrypt.hash(this.contrasena, 10);
//   }
//   next();
// });
