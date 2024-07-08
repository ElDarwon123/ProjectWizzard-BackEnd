import { IsMongoId, IsNumber, IsString } from 'class-validator';

export class CreateProyectoDto {
  @IsNumber()
  fase_idFase: number;


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

  @IsMongoId()
  usuario_id_asignado: string;

}
