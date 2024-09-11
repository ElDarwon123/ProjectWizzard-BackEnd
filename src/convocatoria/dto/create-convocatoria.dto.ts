import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsString,
  IsArray,
  IsOptional,
} from 'class-validator';
import { AnnouncementTemplate } from '../schemas/convocatoria.entity';

export class CreateConvocatoriaDto {
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  fechaInicio: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  fechaCierre: string;

  @ApiProperty({ example: 'Insertar un archivo que contenga información sobre la convocatoria' })
  @IsArray()
  @IsOptional()
  files?: Express.Multer.File[];

  @ApiProperty({ type: AnnouncementTemplate, example: AnnouncementTemplate })
  @IsOptional()
  @IsArray()
  plantilla: AnnouncementTemplate[];
}
