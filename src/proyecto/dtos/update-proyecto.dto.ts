import { IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateProyectoDto {
  @IsNumber()
  @IsOptional()
  fase_idFase?: number;

  @IsString()
  @IsOptional()
  titulo?: string;

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



  

  @IsString()
  @IsOptional()
  estado?: string;

  @IsNumber()
  @IsOptional()
  categoria_idCategoria?: number;

  @IsNumber()
  @IsOptional()
  convocatoria_idConvocatoria?: number;

  @IsNumber()
  @IsOptional()
  usuario_id_asignado?: number;
}
