import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { RolesEnum } from 'src/enums/role.enum';

export class CreateUsuarioDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  apellido: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  numIdentificacion: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  telefono: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  fechaNacimiento: Date;

  @ApiProperty()
  @IsString()
  caracterizacion: string;

  @ApiProperty()
  @IsStrongPassword({minLength: 8, minLowercase: 0, minNumbers: 0, minSymbols: 0, minUppercase: 0})
  @IsNotEmpty()
  contrasena: string;

  @ApiProperty({ enum: RolesEnum })
  @IsNotEmpty()
  @IsEnum(RolesEnum)
  role: RolesEnum;

  @ApiProperty()
  @IsOptional()
  @IsString()
  image?: string;
}
