import { PartialType } from '@nestjs/swagger';
import { CreateSeccionDto } from './create-seccion.dto';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { Schema } from 'mongoose';
import { Proyecto } from 'src/proyecto/schema/proyecto.shema';
import { TipoSeccion } from '../schema/seccion.schema';

export class UpdateSeccionDto extends PartialType(CreateSeccionDto) {

}
