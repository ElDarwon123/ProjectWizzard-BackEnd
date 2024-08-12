import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
export class sendEmail {
  @ApiProperty()
  @IsEmail()
  email: string;
}