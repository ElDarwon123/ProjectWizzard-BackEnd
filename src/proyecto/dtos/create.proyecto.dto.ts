import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsMongoId } from 'class-validator';
import { EstadoProyecto } from '../../enums/estado-proyecto.enum';

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
  usuarioId: string; // Asegúrate de incluir el usuarioId
}
