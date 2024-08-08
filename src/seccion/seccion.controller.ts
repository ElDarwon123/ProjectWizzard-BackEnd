import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SeccionService } from './seccion.service';
import { CreateSeccionDto } from './dto/create-seccion.dto';
import { UpdateSeccionDto } from './dto/update-seccion.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesEnum } from 'src/enums/role.enum';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Seccion } from './schema/seccion.schema';

@ApiTags('Seccion')
@Controller('seccion')
export class SeccionController {
  constructor(private readonly seccionService: SeccionService) {}

  @ApiBody({ type: CreateSeccionDto })
  @ApiResponse({ type: Seccion, status: 201 })
  @ApiBearerAuth('token')
  @Roles(RolesEnum.Aprendiz, RolesEnum.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() createSeccionDto: CreateSeccionDto) {
    return this.seccionService.create(createSeccionDto);
  }

  @ApiResponse({ type: Seccion, status: 200 })
  @ApiBearerAuth('token')
  @Roles(RolesEnum.Aprendiz, RolesEnum.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  findAll() {
    return this.seccionService.findAll();
  }

  @ApiResponse({ type: Seccion, status: 200 })
  @ApiBearerAuth('token')
  @Roles(RolesEnum.Aprendiz, RolesEnum.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seccionService.findOne(id);
  }

  @ApiResponse({ type: Seccion, status: 200 })
  @ApiBearerAuth('token')
  @Roles(RolesEnum.Aprendiz, RolesEnum.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSeccionDto: UpdateSeccionDto) {
    return this.seccionService.update(id, updateSeccionDto);
  }

  @ApiResponse({ type: 'DELETE', status: 200 })
  @ApiBearerAuth('token')
  @Roles(RolesEnum.Aprendiz, RolesEnum.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.seccionService.remove(id);
  }
}
