import { IsEmail, IsString } from 'class-validator';
export class sendEmail {
    @IsEmail() 
    email: string
}