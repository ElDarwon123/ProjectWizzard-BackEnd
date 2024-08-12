import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ObjectId, Types } from 'mongoose';
import { EstadoRevision } from 'src/enums/estado.revision.enum';

export class CreateRevisionDto {
  @ApiProperty()
  @IsMongoId()
  usuario: Types.ObjectId;

  @ApiProperty()
  @IsMongoId()
  seccion: Types.ObjectId;

  @ApiProperty({ enum: EstadoRevision })
  @IsEnum(EstadoRevision)
  estado: EstadoRevision;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  titulo: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  sugerencia: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  descripcion: string;

  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  proyecto: ObjectId;
}
