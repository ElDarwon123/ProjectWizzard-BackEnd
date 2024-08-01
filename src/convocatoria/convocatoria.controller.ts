import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { ConvocatoriaService } from './convocatoria.service';
import { CreateConvocatoriaDto } from './dto/create-convocatoria.dto';
import { UpdateConvocatoriaDto } from './dto/update-convocatoria.dto';
import { Types } from 'mongoose';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Convocatoria')
@Controller('convocatoria')
export class ConvocatoriaController {
  constructor(private readonly convocatoriaService: ConvocatoriaService) {}

  @Post()
  create(
    @Body() createConvocatoriaDto: CreateConvocatoriaDto,
    @Headers() headers: any,
  ) {
    return this.convocatoriaService.create(createConvocatoriaDto, headers);
  }

  @Get()
  findAll() {
    return this.convocatoriaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: Types.ObjectId) {
    return this.convocatoriaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: Types.ObjectId,
    @Body() updateConvocatoriaDto: UpdateConvocatoriaDto,
  ) {
    return this.convocatoriaService.update(id, updateConvocatoriaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: Types.ObjectId) {
    return this.convocatoriaService.remove(id);
  }
}
