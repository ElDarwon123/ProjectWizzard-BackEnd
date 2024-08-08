import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ConvocatoriaService } from './convocatoria.service';
import { CreateConvocatoriaDto } from './dto/create-convocatoria.dto';
import { UpdateConvocatoriaDto } from './dto/update-convocatoria.dto';
import { Types } from 'mongoose';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Convocatoria } from './schemas/convocatoria.entity';

@ApiTags('Convocatoria')
@Controller('convocatoria')
export class ConvocatoriaController {
  constructor(private readonly convocatoriaService: ConvocatoriaService) {}

  @ApiBody({ type: CreateConvocatoriaDto })
  @ApiResponse({ type: Convocatoria, status: 201 })
  @Post()
  create(@Body() createConvocatoriaDto: CreateConvocatoriaDto) {
    return this.convocatoriaService.create(createConvocatoriaDto);
  }
  @ApiResponse({ type: Convocatoria, status: 200 })
  @Get()
  findAll() {
    return this.convocatoriaService.findAll();
  }

  @ApiParam({ name: '_id', type: 'ObjectId' })
  @ApiResponse({ type: CreateConvocatoriaDto, status: 200 })
  @Get(':id')
  findOne(@Param('id') id: Types.ObjectId) {
    return this.convocatoriaService.findOne(id);
  }

  @ApiBody({ type: UpdateConvocatoriaDto })
  @ApiParam({ name: '_id', type: 'ObjectId' })
  @Patch(':id')
  update(
    @Param('id') id: Types.ObjectId,
    @Body() updateConvocatoriaDto: UpdateConvocatoriaDto,
  ) {
    return this.convocatoriaService.update(id, updateConvocatoriaDto);
  }

  @ApiParam({ name: '_id', type: 'ObjectId' })
  @Delete(':id')
  remove(@Param('id') id: Types.ObjectId) {
    return this.convocatoriaService.remove(id);
  }
}
