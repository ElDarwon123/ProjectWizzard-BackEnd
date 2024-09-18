import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';


export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @ApiProperty()
  @IsString()
  @IsOptional()
  deviceToken: string;
}
