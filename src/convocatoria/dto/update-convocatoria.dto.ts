import { PartialType } from '@nestjs/swagger';
import { CreateConvocatoriaDto } from './create-convocatoria.dto';
import { estadoConvocatoria } from 'src/enums/convocatoria.enum';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateConvocatoriaDto extends PartialType(CreateConvocatoriaDto) {
    @IsEnum(estadoConvocatoria)
    @IsOptional()
    estado?: estadoConvocatoria
}
