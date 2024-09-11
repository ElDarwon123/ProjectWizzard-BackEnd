import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  IsArray,
  IsOptional,
} from 'class-validator';
import { estadoConvocatoria } from 'src/enums/convocatoria.enum';
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

  @ApiProperty({ enum: estadoConvocatoria })
  @IsNotEmpty()
  @IsEnum(estadoConvocatoria)
  estado: estadoConvocatoria;

  @ApiProperty({ example: 'Insertar un archivo que contenga información sobre la convocatoria' })
  @IsArray()
  @IsOptional()
  files?: string[];

  @ApiProperty({ type: AnnouncementTemplate, example: AnnouncementTemplate })
  @IsOptional()
  @IsArray()
  plantilla: AnnouncementTemplate[];
}
