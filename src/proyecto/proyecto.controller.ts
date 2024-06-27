import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards } 
from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { CreateProyectoDto } from './dtos/create.proyecto.dto';
import { UpdateProyectoDto } from './dtos/update-proyecto.dto';
import { Proyecto } from './schema/proyecto.shema';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { RolesEnum } from 'src/enums/role.enum';

@Controller('proyectos')
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) {}

  @Post()
  @Roles(RolesEnum.Aprendiz, RolesEnum.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe())
  create(@Body() createProyectoDto: CreateProyectoDto): Promise<Proyecto> {
    return this.proyectoService.create(createProyectoDto);
  }

  @Get()
  @Roles(RolesEnum.Aprendiz, RolesEnum.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  findAll(): Promise<Proyecto[]> {
    return this.proyectoService.findAll();
  }

  @Get(':id')
  @Roles(RolesEnum.Aprendiz, RolesEnum.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  findOne(@Param('id') id: string): Promise<Proyecto> {
    return this.proyectoService.findOne(id);
  }

  @Patch(':id')
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
  @Roles(RolesEnum.Aprendiz, RolesEnum.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  remove(@Param('id') id: string): Promise<Proyecto> {
    return this.proyectoService.remove(id);
  }
}
