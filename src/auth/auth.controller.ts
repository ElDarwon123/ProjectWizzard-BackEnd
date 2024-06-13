/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
//import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthGuard } from './auth.guard';
// autenticatio
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.singIn(
      createAuthDto.email,
      createAuthDto.contrasena,
    );
  }
  // profile 
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.usuario;
  }
}
