import { IsNumber, IsString } from 'class-validator';

export class CreateProyectoDto {
  @IsNumber()
  fase_idFase: number;

  @IsString()
  titulo: string;

  @IsString()
  fecha_creacion: string;

  @IsString()
  estado_idea: string;

  @IsString()
  objetivos_especificos: string;

  @IsString()
  objetivo_general: string;

  @IsString()
  eje_estrategico: string;


  

  @IsString()
  estado: string;

  @IsNumber()
  categoria_idCategoria: number;

  @IsNumber()
  convocatoria_idConvocatoria: number;

  @IsNumber()
  usuario_id_asignado: number;
}
