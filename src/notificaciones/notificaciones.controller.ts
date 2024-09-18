import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { CreateNotificacionProyectoDto } from './dto/create-notificacione.dto';
import { UpdateNotificacionProyectoDto } from './dto/update-notificacion-proyecto.dto';
import { Types } from 'mongoose';
import { CreateNotiAnnouncementDto } from './dto/create-notificacion.dto';
import { UpdateNotiAnnouncementDto } from './dto/update-notificacion-convocatoria.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request as Requ } from 'express';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesEnum } from 'src/enums/role.enum';
import { NotificacionConvocatoria } from './schemas/notificacion-convocatoria.schema';
import { NotificacionProyecto } from './schemas/notificacion-proyecto.schema';

@ApiTags('Notificaciones')
@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  // ==== Announcement Notifications ====

  @Post('convocatoria')
  @ApiBody({ type: CreateNotiAnnouncementDto })
  @ApiResponse({ type: NotificacionConvocatoria, status: 200 })
  createAnnouncementNoti(
    @Body() createAnnouncementNotiDto: CreateNotiAnnouncementDto,
  ) {
    return this.notificacionesService.createNotiAnnouncement(
      createAnnouncementNotiDto,
    );
  }

  @Get('convocatoria')
  @ApiResponse({ type: NotificacionConvocatoria, status: 200 })
  getAllAnnouncementNotis() {
    return this.notificacionesService.findAllNotiAnnouncement();
  }

  @Get('convocatoria/:id')
  @ApiResponse({ type: NotificacionConvocatoria, status: 200 })
  getAnouncementNoti(@Param('id') id: Types.ObjectId) {
    return this.notificacionesService.findOneNotiAnnouncement(id);
  }

  @Patch('convocatoria/:id')
  @ApiBody({ type: UpdateNotiAnnouncementDto })
  @ApiResponse({ type: NotificacionConvocatoria, status: 200 })
  updateAnnouncementNoti(
    @Param('id') id: Types.ObjectId,
    updateAnnDto: UpdateNotiAnnouncementDto,
  ) {
    return this.notificacionesService.updateNotiAnnouncement(id, updateAnnDto);
  }

  @Delete('convocatoria/:id')
  @ApiResponse({ type: NotificacionConvocatoria, status: 200 })
  deleteAnnouncementNoti(@Param('id') id: Types.ObjectId) {
    return this.notificacionesService.removeNotiAnnouncement(id);
  }

  // ==== Project Notifications ====
  @ApiBody({ type: CreateNotificacionProyectoDto })
  @ApiResponse({ type: NotificacionProyecto, status: 200 })
  @Post('proyecto')
  createProjectNoti(
    @Body() createNotificacioneDto: CreateNotificacionProyectoDto,
  ) {
    return this.notificacionesService.createNotiProject(createNotificacioneDto);
  }

  @Get('mis-proyectos')
  @ApiResponse({ type: NotificacionProyecto, status: 200 })
  async findAllProjectNotis(@Request() req: Requ) {
    const token = req.headers.authorization.split(' ')[1];
    return await this.notificacionesService.findAllNotisProjects(token);
  }

  @Get('proyectos')
  @ApiResponse({ type: NotificacionProyecto, status: 200 })
  async findAdminProjectNotis() {
    return this.notificacionesService.findAdminNotiProject();
  }

  @Get('mis-proyectos/:id')
  @ApiResponse({ type: NotificacionProyecto, status: 200 })
  findOneProjectNoti(@Param('id') id: Types.ObjectId) {
    return this.notificacionesService.findOneNotiProject(id);
  }

  @Patch('mis-proyectos/:id')
  @ApiBody({ type: UpdateNotificacionProyectoDto })
  @ApiResponse({ type: NotificacionProyecto, status: 200 })
  updateProjectNoti(
    @Param('id') id: Types.ObjectId,
    @Body() updateNotificacioneDto: UpdateNotificacionProyectoDto,
  ) {
    return this.notificacionesService.updateNotiProject(
      id,
      updateNotificacioneDto,
    );
  }

  @Delete('mis-proyectos/:id')
  @ApiResponse({ type: NotificacionProyecto, status: 200 })
  removeProjectNoti(@Param('id') id: Types.ObjectId) {
    return this.notificacionesService.removeNotiProject(id);
  }
}
