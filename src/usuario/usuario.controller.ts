import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { RolesEnum } from 'src/enums/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { ObjectId, Types } from 'mongoose';
import { UpdateDeviceTokenDto } from './dto/update-deviceToken.dto';

@ApiTags('Usuario')
@Controller('auth/usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @Get()
  @Roles(RolesEnum.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  @Roles(RolesEnum.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  @Patch(':id/device-token')
  async updateDeviceToken(
    @Param('id') id: Types.ObjectId,
    @Body() updateDeviceToken: UpdateDeviceTokenDto,
  ) {
    const updateUser = await this.usuarioService.updateDeviceToken(
      id,
      updateDeviceToken,
    );
    if (!updateUser) {
      throw new NotFoundException('User not found');
    }
    return updateUser;
  }

  @Delete(':id')
  @Roles(RolesEnum.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: Types.ObjectId) {
    return this.usuarioService.remove(id);
  }
}
