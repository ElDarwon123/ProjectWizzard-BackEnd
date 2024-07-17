/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  NotFoundException,
  Request,
  UseGuards,
  Response,
} from '@nestjs/common';
//import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthGuard } from './guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { Request as Requ } from 'express';
// autenticatio
@ApiTags('Autorizaciones, Iniciar Sesión y Ver Perfil')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    return req.user;
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Post('logout')
  async logOut(@Request() req: Requ, @Response() res: Requ) {
    const token = req.headers.authorization.split(' ')[1];
    await this.authService.logOut(token);
  }
}
