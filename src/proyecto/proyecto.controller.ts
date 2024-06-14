import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } 
from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { CreateProyectoDto } from './dtos/create.proyecto.dto';
import { UpdateProyectoDto } from './dtos/update-proyecto.dto';
import { Proyecto } from './schema/proyecto.shema';

@Controller('proyectos')
export class ProyectoController {
  constructor(private readonly proyectoService: ProyectoService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createProyectoDto: CreateProyectoDto): Promise<Proyecto> {
    return this.proyectoService.create(createProyectoDto);
  }

  @Get()
  findAll(): Promise<Proyecto[]> {
    return this.proyectoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Proyecto> {
    return this.proyectoService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: string, @Body() updateProyectoDto: UpdateProyectoDto): Promise<Proyecto> {
    return this.proyectoService.update(id, updateProyectoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Proyecto> {
    return this.proyectoService.remove(id);
  }
}
