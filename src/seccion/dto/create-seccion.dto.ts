import { IsArray, IsMongoId, IsNotEmpty, IsObject, IsString } from 'class-validator';
import mongoose, { ObjectId } from 'mongoose';
import { TipoSeccion } from '../schema/seccion.schema';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSeccionDto {
  @ApiProperty()
  @IsMongoId()
  @IsNotEmpty()
  proyecto: ObjectId;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  tipoSeccion: TipoSeccion[];
}
