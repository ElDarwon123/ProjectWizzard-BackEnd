
import { IsString, IsEnum } from 'class-validator';
import { EstadoProyecto } from '../../enums/estado-proyecto.enum';

export class CreateProyectoDto {
  @IsString()
  titulo: string;

  @IsString()
  fecha: string;

  @IsEnum(EstadoProyecto)
  estado: EstadoProyecto;
}
