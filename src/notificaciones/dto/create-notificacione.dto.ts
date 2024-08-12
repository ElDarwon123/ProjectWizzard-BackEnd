import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { notiStateEnum } from 'src/enums/estado-noti.enum';
import { Proyecto } from 'src/proyecto/schema/proyecto.shema';

export class CreateNotificacionProyectoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  body: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  proyecto: Proyecto;

  @ApiProperty({ enum: notiStateEnum })
  @IsOptional()
  @IsEnum(notiStateEnum)
  estado: notiStateEnum
}
