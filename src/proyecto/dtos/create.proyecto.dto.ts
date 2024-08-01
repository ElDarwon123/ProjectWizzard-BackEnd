import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsMongoId } from 'class-validator';
import { EstadoProyecto } from '../../enums/estado-proyecto.enum';
import { ObjectId } from 'mongoose';

export class CreateProyectoDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @IsEnum(EstadoProyecto)
  @IsOptional()
  estado?: EstadoProyecto;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsMongoId()
  @IsNotEmpty()
  usuarioId: ObjectId;

  @IsOptional()
  @IsString()
  image: string;
}
