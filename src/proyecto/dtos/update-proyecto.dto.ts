import { IsString, IsOptional, IsEnum } from 'class-validator';
import { EstadoProyecto } from '../../enums/estado-proyecto.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProyectoDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  titulo?: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  fecha?: string;

  @IsEnum(EstadoProyecto)
  @IsOptional()
  @ApiProperty()
  estado?: EstadoProyecto;

  @IsString()
  @IsOptional()
  @ApiProperty()
  descripcion?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  image?: string;
}
