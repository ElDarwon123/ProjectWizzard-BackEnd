import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateNotificacionProyectoDto } from './dto/create-notificacione.dto';
import { UpdateNotificacionProyectoDto } from './dto/update-notificacion-proyecto.dto';
import { CreateNotiAnnouncementDto } from './dto/create-notificacion.dto';
import { InjectModel } from '@nestjs/mongoose';
import { NotificacionProyecto } from './schemas/notificacion-proyecto.schema';
import { Model, Types, IfEquals } from 'mongoose';
import { NotificacionConvocatoria } from './schemas/notificacion-convocatoria.schema';
import { UpdateNotiAnnouncementDto } from './dto/update-notificacion-convocatoria.dto';
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
    try {
      const noti = new this.notiConv(createNotificacioneDto);
      await noti.save();
      return noti;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAllNotiAnnouncement(): Promise<NotificacionConvocatoria[]> {
    try {
      const notis = await this.notiConv.find().populate('convocatoria');

      const notisFiltered = Promise.all(
        notis.filter(async (noti) => {
          if (noti.convocatoria === null) {
            await this.notiConv.findByIdAndDelete(noti._id);
          }
          return noti && noti.convocatoria;
        }),
      );
      return notisFiltered;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async findOneNotiAnnouncement(
    id: Types.ObjectId,
  ): Promise<NotificacionConvocatoria> {
    try {
      const noti = await this.notiConv.findById(id).populate('convocatoria');
      return noti;
    } catch (error) {
      throw new NotFoundException('Announcement not found');
    }
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
    try {
      const notis = await this.notiProject
        .find()
        .populate({
          path: 'proyecto',
          select: ['titulo', 'usuarioId'],
          populate: {
            path: 'usuarioId',
            select: ['nombre', 'apellido'],
          },
        })
        .exec();

      const filteredNotis = Promise.all(
        notis.filter(async (noti) => {
          const note = noti.title;
          if (
            noti.proyecto === null ||
            noti.title !== 'Se ha subido un nuevo proyecto!'
          ) {
            await this.notiProject.findByIdAndDelete(noti._id);
          }
          return (
            noti.proyecto !== null && note === 'Se ha subido un nuevo proyecto!'
          );
        }),
      );

      return filteredNotis;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async findAllNotisProjects(token: string): Promise<NotificacionProyecto[]> {
    let user: string;
    try {
      const decoded = this.jwtService.decode(token);
      user = decoded.sub._id;

      const notis = await this.notiProject
        .find()
        .populate({
          path: 'proyecto',
          select: ['title', 'usuarioId'],
        })
        .exec();

      const filteredNotis = notis.filter((noti) => {
        const proyecto = noti.proyecto;
        if (noti.proyecto === null || noti.proyecto.usuarioId === null) {
          this.notiProject.findByIdAndDelete(noti._id);
        }
        
        return (
          proyecto &&
          proyecto.usuarioId &&
          proyecto.usuarioId._id.toString() === user &&
          noti.title !== 'Se ha subido un nuevo proyecto!'
        );
      });

      
      return filteredNotis;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      } else {
        throw new UnauthorizedException('Unauthorized access');
      }
    }
  }

  async findOneNotiProject(id: Types.ObjectId): Promise<NotificacionProyecto> {
    try {
      const noti = await this.notiProject.findById(id).populate('proyecto');
      return noti;
    } catch (error) {
      throw new UnauthorizedException('Invalid Token');
    }
  }

  async updateNotiProject(
    id: Types.ObjectId,
    updateNotificacioneDto: UpdateNotificacionProyectoDto,
  ): Promise<NotificacionProyecto> {
    try {
      const noti = await this.notiProject
        .findByIdAndUpdate(id, updateNotificacioneDto)
        .populate('proyecto');
      return noti;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async removeNotiProject(id: Types.ObjectId): Promise<NotificacionProyecto> {
    try {
      const delNoti = await this.notiProject.findByIdAndDelete(id);
      return delNoti;
    } catch (error) {
      throw new NotFoundException('Noti not found');
    }
  }
}
