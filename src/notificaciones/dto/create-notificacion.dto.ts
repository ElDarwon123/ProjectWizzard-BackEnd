import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Convocatoria } from 'src/convocatoria/schemas/convocatoria.entity';
import { notiStateEnum } from 'src/enums/estado-noti.enum';

export class CreateNotiAnnouncementDto {
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

  @ApiProperty({ type: Convocatoria })
  @IsMongoId()
  @IsNotEmpty()
  convocatoria: Convocatoria;

  @ApiProperty({ enum: notiStateEnum })
  @IsOptional()
  @IsEnum(notiStateEnum)
  estado: notiStateEnum
}
