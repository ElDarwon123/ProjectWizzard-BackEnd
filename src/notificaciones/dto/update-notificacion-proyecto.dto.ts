import { PartialType } from '@nestjs/swagger';
import { CreateNotificacionProyectoDto } from './create-notificacione.dto';

export class UpdateNotificacionProyectoDto extends PartialType(
  CreateNotificacionProyectoDto,
) {}
