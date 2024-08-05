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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { RolesEnum } from 'src/enums/role.enum';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ObjectId, Types } from 'mongoose';
import { UpdateDeviceTokenDto } from './dto/update-deviceToken.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Usuario } from './schema/usuario.schema';

@ApiTags('Usuario')
@Controller('auth/usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiBody({type: CreateUsuarioDto })
  create(
    @Body() createUsuarioDto: CreateUsuarioDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const imageBuffer = image ? image.buffer : undefined;
    const imageDestination = image
      ? `projects/${createUsuarioDto.email}/cover.${image.originalname.split('.').pop()}`
      : undefined;
    const imageMymeType = image ? image.mimetype : undefined;

    return this.usuarioService.create(
      createUsuarioDto,
      imageBuffer,
      imageDestination,
      imageMymeType,
    );
  }

  @Get()
  @Roles(RolesEnum.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Usuario> {
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
    return updateUser;
  }

  @Roles(RolesEnum.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: Types.ObjectId) {
    return this.usuarioService.remove(id);
  }
}
