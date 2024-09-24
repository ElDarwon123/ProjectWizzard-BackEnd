import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateConvocatoriaDto } from './create-convocatoria.dto';
import { estadoConvocatoria } from 'src/enums/convocatoria.enum';
import { IsEnum, IsMongoId, IsOptional } from 'class-validator';
import { ObjectId } from 'mongoose';

export class UpdateConvocatoriaDto extends PartialType(CreateConvocatoriaDto) {
    @ApiProperty()
    @IsEnum(estadoConvocatoria)
    @IsOptional()
    estado?: estadoConvocatoria

    @ApiProperty()
    @IsMongoId()
    @IsOptional()
    proyectos: ObjectId;

}
