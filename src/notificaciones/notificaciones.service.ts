import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateNotificacionProyectoDto } from './dto/create-notificacione.dto';
import { UpdateNotificacionProyectoDto } from './dto/update-notificacion-proyecto.dto';
import { CreateNotiAnnouncementDto } from './dto/create-notificacion.dto';
import { InjectModel } from '@nestjs/mongoose';
import { NotificacionProyecto } from './schemas/notificacion-proyecto.schema';
import { Model, Types } from 'mongoose';
import { NotificacionConvocatoria } from './schemas/notificacion-convocatoria.schema';
import { UpdateNotiAnnouncementDto } from './dto/update-notificacion-convocatoria.dto';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Proyecto } from 'src/proyecto/schema/proyecto.shema';


@Injectable()
export class NotificacionesService {
  constructor(
    @InjectModel(NotificacionProyecto.name)
    private readonly notiProject: Model<NotificacionProyecto>,
    @InjectModel(NotificacionConvocatoria.name)
    private readonly notiConv: Model<NotificacionConvocatoria>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // ==== ANNOUNCEMENT NOTIFICACIONS ====

  async createNotiAnnouncement(
    createNotificacioneDto: CreateNotiAnnouncementDto,
  ): Promise<NotificacionConvocatoria> {
    const noti = new this.notiConv(createNotificacioneDto);
    await noti.save();
    return noti;
  }

  async findAllNotiAnnouncement(): Promise<NotificacionConvocatoria[]> {
    const notis = await this.notiConv.find().populate('convocatoria');
    return notis;
  }

  async findOneNotiAnnouncement(
    id: Types.ObjectId,
  ): Promise<NotificacionConvocatoria> {
    const noti = await this.notiConv.findById(id).populate('convocatoria');
    return noti;
  }

  async updateNotiAnnouncement(
    id: Types.ObjectId,
    updateNotiDto: UpdateNotiAnnouncementDto,
  ): Promise<NotificacionConvocatoria> {
    const noti = await this.notiConv.findOne(id);
    if (!noti) {
      throw new NotFoundException('Notification not found');
    }
    return await this.notiConv.findByIdAndUpdate(id, updateNotiDto, {
      new: true,
    });
  }

  async removeNotiAnnouncement(id: Types.ObjectId) {
    const delNoti = await this.notiConv.findByIdAndDelete(id);
    return delNoti;
  }

  // ==== PROJECT NOTIFICACIONS ====

  async createNotiProject(
    createNotificacioneDto: CreateNotificacionProyectoDto,
  ): Promise<NotificacionProyecto> {
    const noti = new this.notiProject(createNotificacioneDto);
    await noti.save();
    return noti;
  }

  //  When a project is created, the admin gets a notification 
  async findAdminNotiProject(): Promise<NotificacionProyecto[]> {
    const notis = await this.notiProject.find().exec();

    const filteredNotis = notis.filter((noti) => {
      const nota = noti.title;
      return nota === 'Se ha subido un nuevo proyecto!';
    })
    return filteredNotis;
  }
  
  async findAllNotisProjects(token: any): Promise<NotificacionProyecto[]> {

    let user: string;
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      user = decoded.sub._id;
      console.log(user);
      
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
    const notis = await this.notiProject.find().populate({
      path: 'proyecto',
      select: 'usuarioId'
    }).exec();

    const filteredNotis = notis.filter((noti) => {
      const proyecto = noti.proyecto as Proyecto;      
      return proyecto.usuarioId.toString() === user;
    });
    
    return filteredNotis;
  }

  async findOneNotiProject(id: Types.ObjectId): Promise<NotificacionProyecto> {
    const noti = await this.notiProject.findById(id).populate('proyecto');
    return noti;
  }

  async updateNotiProject(
    id: Types.ObjectId,
    updateNotificacioneDto: UpdateNotificacionProyectoDto,
  ): Promise<NotificacionProyecto> {
    const noti = await this.notiProject
      .findByIdAndUpdate(id, updateNotificacioneDto)
      .populate('proyecto');
    return noti;
  }

  async removeNotiProject(id: Types.ObjectId): Promise<NotificacionProyecto> {
    const delNoti = await this.notiProject.findByIdAndDelete(id);
    return delNoti;
  }
}
