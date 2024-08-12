import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsMongoId } from 'class-validator';
import { EstadoProyecto } from '../../enums/estado-proyecto.enum';
import { ObjectId } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProyectoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  fecha: string;

  @ApiProperty({ enum: EstadoProyecto })
  @IsEnum(EstadoProyecto)
  @IsOptional()
  estado?: EstadoProyecto;
  
  @ApiProperty()
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  usuarioId: ObjectId;

  @ApiProperty()
  @IsOptional()
  @IsString()
  image: string;
}
