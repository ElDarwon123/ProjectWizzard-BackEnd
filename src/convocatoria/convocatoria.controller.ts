import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConvocatoriaService } from './convocatoria.service';
import { CreateConvocatoriaDto } from './dto/create-convocatoria.dto';
import { UpdateConvocatoriaDto } from './dto/update-convocatoria.dto';
import { ObjectId } from 'mongoose';

@Controller('convocatoria')
export class ConvocatoriaController {
  constructor(private readonly convocatoriaService: ConvocatoriaService) {}

  @Post()
  create(@Body() createConvocatoriaDto: CreateConvocatoriaDto) {
    return this.convocatoriaService.create(createConvocatoriaDto);
  }

  @Get()
  findAll() {
    return this.convocatoriaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: ObjectId) {
    return this.convocatoriaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: ObjectId, @Body() updateConvocatoriaDto: UpdateConvocatoriaDto) {
    return this.convocatoriaService.update(id, updateConvocatoriaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: ObjectId) {
    return this.convocatoriaService.remove(id);
  }
}
