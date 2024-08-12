import { IsString, IsOptional, IsEnum } from 'class-validator';
import { EstadoProyecto } from '../../enums/estado-proyecto.enum';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProyectoDto } from './create.proyecto.dto';

export class UpdateProyectoDto extends PartialType(CreateProyectoDto) {

}
