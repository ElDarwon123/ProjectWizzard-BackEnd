import { PartialType } from '@nestjs/swagger';
import { CreateNotiAnnouncementDto } from './create-notificacion.dto';

export class UpdateNotiAnnouncementDto extends PartialType(
  CreateNotiAnnouncementDto,
) {}
