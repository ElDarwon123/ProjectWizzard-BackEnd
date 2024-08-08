import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { CreateProyectoDto } from './dtos/create.proyecto.dto';
import { UpdateProyectoDto } from './dtos/update-proyecto.dto';
import { Proyecto } from './schema/proyecto.shema';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { RolesEnum } from 'src/enums/role.enum';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsuarioService } from 'src/usuario/usuario.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ObjectId } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';

@ApiTags('Proyecto')
@Controller('proyectos')
export class ProyectoController {
  constructor(
    private readonly proyectoService: ProyectoService,
    private readonly authService: AuthService
  ) {}

  @Post()
  @ApiBody({ type: CreateProyectoDto })
  @ApiResponse({ type: Proyecto, status: 200 })
  @ApiBearerAuth('token')
  @Roles(RolesEnum.Aprendiz, RolesEnum.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  create(
    @Body() createProyectoDto: CreateProyectoDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<Proyecto> {
    const imageBuffer = image ? image.buffer : undefined;
    const imageDestination = image
      ? `projects/${createProyectoDto.titulo}/cover.${image.originalname.split('.').pop()}`
      : undefined;
    const imageMymeType = image ? image.mimetype : undefined;

    return this.proyectoService.create(
      createProyectoDto,
      imageBuffer,
      imageDestination,
      imageMymeType,
    );
  }

  @Post(':id/files')
  @UseInterceptors(FilesInterceptor('files'))
  async addFiles(
    @Param('id') projectId: ObjectId,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log(files);
    await this.proyectoService.addFileToProject(projectId, files);
    return { message: 'Files added successfully' };
  }

  @Get()
  @ApiBearerAuth('token')
  @ApiResponse({ type: Proyecto, status: 200 })
  @Roles(RolesEnum.Aprendiz, RolesEnum.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  findAll(): Promise<Proyecto[]> {
    return this.proyectoService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('token')
  @ApiResponse({ type: Proyecto, status: 200 })
  @Roles(RolesEnum.Aprendiz, RolesEnum.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  findOne(@Param('id') id: string): Promise<Proyecto> {
    return this.proyectoService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('token')
  @ApiResponse({ type: Proyecto, status: 200 })
  @Roles(RolesEnum.Aprendiz, RolesEnum.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe())
  update(
    @Param('id') id: string,
    @Body() updateProyectoDto: UpdateProyectoDto,
  ): Promise<Proyecto> {
    return this.proyectoService.update(id, updateProyectoDto);
  }

  @Delete(':id')
  @ApiBearerAuth('token')
  @ApiResponse({ type: Proyecto, status: 200 })
  @Roles(RolesEnum.Aprendiz, RolesEnum.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string): Promise<Proyecto> {
    return this.proyectoService.remove(id);
  }
}
