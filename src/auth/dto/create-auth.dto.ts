import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiBody } from '@nestjs/swagger';

export class CreateAuthDto {
  @IsString()
  @IsNotEmpty()

  
  email: string;
  @IsString()


  //@MinLength(7)
  @IsNotEmpty()
  contrasena: string;
}
