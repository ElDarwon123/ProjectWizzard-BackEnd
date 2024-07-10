import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateRevisionDto {
  @IsMongoId()
  usuario: Types.ObjectId;
  @IsMongoId()
  seccion: Types.ObjectId;
  @IsString()
  @IsOptional()
  estado: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  sugerencia: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  descripcion: string;
}
