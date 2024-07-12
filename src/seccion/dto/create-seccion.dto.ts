import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateSeccionDto {
  @IsMongoId()
  @IsNotEmpty()
  proyecto: string;
  @IsString()
  @IsNotEmpty()
  tipoSeccion: string;
}
