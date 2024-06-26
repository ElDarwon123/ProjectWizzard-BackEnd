import { IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { RolesEnum } from 'src/enums/role.enum';

// poner la fecha de nacimiento tipo Date, or ahora se crea atomaticamente
/*
    @IsDateString()
    @IsOptional()
    fechaNacimiento?: Date;
  */


export class CreateUsuarioDto {
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
  @IsString()
  caracterizacion: string;
  @IsString()
  @IsNotEmpty()
  contrasena: string;
  @IsNotEmpty()
  @IsEnum(RolesEnum)
  role: string;
}
