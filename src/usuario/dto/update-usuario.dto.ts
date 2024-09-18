import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';


export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    notificaciones?: boolean
}
