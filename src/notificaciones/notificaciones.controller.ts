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

@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  // ==== Announcement Notifications ====

  @Post('convocatoria')
  createAnnouncementNoti(
    @Body() createAnnouncementNotiDto: CreateNotiAnnouncementDto,
  ) {
    return this.notificacionesService.createNotiAnnouncement(
      createAnnouncementNotiDto,
    );
  }

  @Get('convocatoria')
  getAllAnnouncementNotis() {
    return this.notificacionesService.findAllNotiAnnouncement();
  }

  @Get('convocatoria/:id')
  getAnouncementNoti(@Param('id') id: Types.ObjectId) {
    return this.notificacionesService.findOneNotiAnnouncement(id);
  }

  @Patch('convocatoria/:id')
  updateAnnouncementNoti(
    @Param('id') id: Types.ObjectId,
    updateAnnDto: UpdateNotiAnnouncementDto,
  ) {
    return this.notificacionesService.updateNotiAnnouncement(id, updateAnnDto);
  }

  @Delete('convocatoria/:id')
  deleteAnnouncementNoti(@Param('id') id: Types.ObjectId) {
    return this.notificacionesService.removeNotiAnnouncement(id);
  }

  // ==== Project Notifications ====

  @Post('proyecto')
  createProjectNoti(
    @Body() createNotificacioneDto: CreateNotificacionProyectoDto,
  ) {
    return this.notificacionesService.createNotiProject(createNotificacioneDto);
  }

  @Get('proyecto')
  async findAllProjectNotis(@Request() req: Requ) {
    const token = req.headers.authorization.split(' ')[1];
    return await this.notificacionesService.findAllNotisProjects(token);
  }

  @Get('proyecto/:id')
  findOneProjectNoti(@Param('id') id: Types.ObjectId) {
    return this.notificacionesService.findOneNotiProject(id);
  }

  @Patch('proyecto/:id')
  updateProjectNoti(
    @Param('id') id: Types.ObjectId,
    @Body() updateNotificacioneDto: UpdateNotificacionProyectoDto,
  ) {
    return this.notificacionesService.updateNotiProject(
      id,
      updateNotificacioneDto,
    );
  }

  @Delete('proyecto/:id')
  removeProjectNoti(@Param('id') id: Types.ObjectId) {
    return this.notificacionesService.removeNotiProject(id);
  }
}
