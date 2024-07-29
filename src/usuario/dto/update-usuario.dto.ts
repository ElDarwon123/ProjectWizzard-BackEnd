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
  @IsOptional()
  nombre?: string;
  @IsString()
  @IsOptional()
  apellido?: string;
  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;
  @IsString()
  @IsOptional()
  numIdentificacion?: string;
  @IsString()
  @IsOptional()
  telefono?: string;
  @IsDateString()
  @IsOptional()
  fechaNacimiento?: Date;
  @IsString()
  @IsOptional()
  caracterizacion?: string;
  @IsString()
  @IsOptional()
  contrasena?: string;
  @IsOptional()
  @IsEnum(RolesEnum)
  role?: string;
}
