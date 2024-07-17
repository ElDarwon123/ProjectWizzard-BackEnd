import { IsDateString, IsEmail, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RolesEnum } from 'src/enums/role.enum';

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
  @IsDateString()
  @IsNotEmpty()
  fechaNacimiento: Date;
  @IsString()
  caracterizacion: string;
  @IsString()
  @IsNotEmpty()
  contrasena: string;
  @IsNotEmpty()
  @IsEnum(RolesEnum)
  role: string;
}
