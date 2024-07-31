import { PartialType } from '@nestjs/swagger';
import { CreateConvocatoriaDto } from './create-convocatoria.dto';

export class UpdateConvocatoriaDto extends PartialType(CreateConvocatoriaDto) {}
