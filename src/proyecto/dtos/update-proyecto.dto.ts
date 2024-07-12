import { IsString, IsOptional, IsEnum } from 'class-validator';
import { EstadoProyecto } from '../../enums/estado-proyecto.enum';

export class UpdateProyectoDto {
  @IsString()
  @IsOptional()
  titulo?: string;

  @IsString()
  @IsOptional()
  fecha?: string;

  @IsEnum(EstadoProyecto)
  @IsOptional()
  estado?: EstadoProyecto;

  @IsString()
  @IsOptional()
  descripcion?: string;
}
