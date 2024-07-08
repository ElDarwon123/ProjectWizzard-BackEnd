import { IsNumber,IsMongoId, IsString, IsOptional } from 'class-validator';

export class UpdateProyectoDto {
  @IsNumber()
  @IsOptional()
  fase_idFase?: number;

  @IsString()
  @IsOptional()
  fecha_creacion?: string;

  @IsString()
  @IsOptional()
  estado_idea?: string;

  @IsString()
  @IsOptional()
  objetivos_especificos?: string;

  @IsString()
  @IsOptional()
  objetivo_general?: string;

  @IsString()
  @IsOptional()
  eje_estrategico?: string;

  @IsOptional()
  @IsMongoId()
  usuario_id_asignado?: string;

}
