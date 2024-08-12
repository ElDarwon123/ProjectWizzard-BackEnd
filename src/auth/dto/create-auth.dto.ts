import { IsNotEmpty, IsString, MinLength, IsEmail } from 'class-validator';
import { ApiProperty, ApiBody } from '@nestjs/swagger';

export class CreateAuthDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contrasena: string;
}
