import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty, ApiBody } from '@nestjs/swagger';

export class CreateAuthDto {
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  contrasena: string;
}
