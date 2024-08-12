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
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiBearerAuth('token')
  @ApiBody({ type: CreateUsuarioDto })
  @ApiResponse({ type: Usuario, status: 200 })
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
  @ApiResponse({ type: Usuario, status: 200 })
  @ApiBearerAuth('token')
  @Roles(RolesEnum.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  findAll() {
    return this.usuarioService.findAll();
  }

  @Get('counter')
  @ApiResponse({ type: Number, status: 200 })
  HowManyUsers() {
    return this.usuarioService.HowManyUsers()
  }

  @Get(':id')
  @ApiBearerAuth('token')
  @ApiResponse({ type: Usuario, status: 200 })
  @ApiParam({ name: 'id', type: 'ObjectId' })
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('token')
  @ApiResponse({ type: Usuario, status: 200 })
  @ApiParam({ name: 'id', type: 'ObjectId' })
  @UseInterceptors(FileInterceptor('image'))
  update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Usuario> {
    return this.usuarioService.update(id, updateUsuarioDto);
  }

  @Delete(':id')
  @ApiBearerAuth('token')
  @ApiResponse({ type: Usuario, status: 200 })
  @ApiParam({ name: 'id', type: 'ObjectId' })
  @Roles(RolesEnum.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: Types.ObjectId) {
    return this.usuarioService.remove(id);
  }
}
