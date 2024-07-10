
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { EstadoProyecto } from '../../enums/estado-proyecto.enum';

export class UpdateProyectoDto {
  @IsOptional()
  @IsString()
  titulo?: string;

  @IsOptional()
  @IsString()
  fecha?: string;

  @IsOptional()
  @IsEnum(EstadoProyecto)
  estado?: EstadoProyecto;
}
