import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { RolesEnum } from 'src/enums/role.enum';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @IsString()
  @IsNotEmpty()
  nombre: string;
  @IsString()
  @IsNotEmpty()
  apellido: string;
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  numIdentificacion: string;
  @IsString()
  telefono: string;
  @IsDateString()
  @IsOptional()
  fechaNacimiento?: Date;
  @IsString()
  caracterizacion: string;
  @IsString()
  @IsNotEmpty()
  contrasena: string;
  @IsNotEmpty()
  @IsEnum(RolesEnum)
  role: string;
}
