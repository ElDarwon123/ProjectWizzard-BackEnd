import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { Role } from 'src/role/schema/role.schema';
import { Types } from 'mongoose';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
    // nombre: string;
    // apellido: string;
    // email: string;
    // telefono: string;
    // caracterizacion: string;
    // contrasena: string;
    // role: Types.ObjectId
}
