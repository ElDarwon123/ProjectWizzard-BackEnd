import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConvocatoriaService } from './convocatoria.service';
import { CreateConvocatoriaDto } from './dto/create-convocatoria.dto';
import { UpdateConvocatoriaDto } from './dto/update-convocatoria.dto';
import { ObjectId, Types } from 'mongoose';
import { ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Convocatoria } from './schemas/convocatoria.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesEnum } from 'src/enums/role.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AddProjToAnnouncementDto } from './dto/addProject-to-convocatoria.dto';

@ApiTags('Convocatoria')
@Controller('convocatoria')
export class ConvocatoriaController {
  constructor(private readonly convocatoriaService: ConvocatoriaService) { }

  @ApiBody({ type: CreateConvocatoriaDto, description: "For the 'file' property, needs an FIle input, it receives an file and save a file firebase url" })
  @ApiResponse({ type: Convocatoria, status: 201 })
  @UseInterceptors(FilesInterceptor('files'))
  @Post()
  create(
    @Body() createConvocatoriaDto: CreateConvocatoriaDto,
    @UploadedFiles() file: Express.Multer.File[]
  ): Promise<Convocatoria> {

    return this.convocatoriaService.create(createConvocatoriaDto, file);
  }

  @Post(':id/add-proj')
  @ApiResponse({ type: Convocatoria, status: 200 })
  @ApiBody({required: true, type: AddProjToAnnouncementDto, })
  @ApiParam({name: 'id', type: Types.ObjectId, example: '66da09113e70ed34c1368824', description: 'it must to be a mongo id'})
  async addProjectToAnnouncement(@Param('id') ann: Types.ObjectId, @Body() proj: AddProjToAnnouncementDto) {

    return this.convocatoriaService.addProjectToAnnouncement(proj, ann);
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
