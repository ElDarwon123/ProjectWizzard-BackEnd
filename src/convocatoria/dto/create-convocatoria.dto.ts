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
import { templateAnnouncement } from '../schemas/convocatoria.entity';

export class CreateConvocatoriaDto {
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  fechaInicio: Date;

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

  @ApiProperty({ type: templateAnnouncement, example: templateAnnouncement })
  @IsOptional()
  @IsArray()
  plantilla: templateAnnouncement[];
}
