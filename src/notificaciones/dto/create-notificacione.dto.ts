import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { notiStateEnum } from 'src/enums/estado-noti.enum';
import { Proyecto } from 'src/proyecto/schema/proyecto.shema';

export class CreateNotificacionProyectoDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  body: string;
  @IsString()
  @IsNotEmpty()
  url: string;
  @IsMongoId()
  @IsNotEmpty()
  proyecto: Proyecto;
}
