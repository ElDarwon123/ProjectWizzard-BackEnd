import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { EstadoProyecto } from '../../enums/estado-proyecto.enum';

export class CreateProyectoDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsString()
  @IsNotEmpty()
  fecha: string;

  @IsEnum(EstadoProyecto)
  @IsOptional()
  estado?: EstadoProyecto;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsString()
  @IsNotEmpty()
  usuarioId: string; // Asegúrate de incluir el usuarioId
}
