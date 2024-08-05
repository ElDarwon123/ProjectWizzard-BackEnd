import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { Convocatoria } from 'src/convocatoria/schemas/convocatoria.entity';
import { notiStateEnum } from 'src/enums/estado-noti.enum';

export class CreateNotiAnnouncementDto {
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
  convocatoria: Convocatoria;
}
