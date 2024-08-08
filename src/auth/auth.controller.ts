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
  Patch,
  Param,
} from '@nestjs/common';
//import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthGuard } from './guards/auth.guard';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request as Requ, Response as Res } from 'express';
import { UpdateUsuarioDto } from 'src/usuario/dto/update-usuario.dto';
import { CreateUsuarioDto } from 'src/usuario/dto/create-usuario.dto';
import { sendEmail } from './dto/send-email.dto';
import { Usuario } from 'src/usuario/schema/usuario.schema';
import { CreateBlackList } from './dto/create-blackList.dto';
// autenticatio
@ApiTags('Autorizaciones, Iniciar Sesión y Ver Perfil')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiBody({ type: CreateAuthDto })
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.singIn(
      createAuthDto.email,
      createAuthDto.contrasena,
    );
  }
  // profile
  @Get('profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('token')
  @ApiResponse({ type: Usuario, status: 200 })
  getProfile(@Request() req) {
    return req.user;
  }
  @Post('logout')
  @ApiBody({ type: CreateBlackList })
  @ApiResponse({ type: 'Logout successful', status: 200 })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async logOut(@Request() req: Requ, @Response() res: Res) {
    const token = req.headers.authorization.split(' ')[1];
    await this.authService.logOut({ token });
    res.status(HttpStatus.OK).json({ message: 'Logout successful' });
  }

  @Post('forgot-password')
  @ApiBody({ type: sendEmail })
  @ApiResponse({ type: 'Email sent', status: 200 })
  async forgotPassword(@Body() user: sendEmail, @Response() res: Res) {
    res
      .status(HttpStatus.OK)
      .json(await this.authService.sendPassWordResetEmail(user.email));
  }

  @Patch('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body() newPassword: UpdateUsuarioDto,
  ) {
    return await this.authService.resetPassword(token, newPassword);
  }
}
