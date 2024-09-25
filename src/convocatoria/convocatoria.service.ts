import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateConvocatoriaDto } from './dto/create-convocatoria.dto';
import { UpdateConvocatoriaDto } from './dto/update-convocatoria.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Convocatoria } from './schemas/convocatoria.entity';
import { Model, ObjectId, Types } from 'mongoose';
import { FirebaseService } from 'src/firebase/firebase.service';
import { NotificacionesService } from 'src/notificaciones/notificaciones.service';
import { notiStateEnum } from 'src/enums/estado-noti.enum';
import { ConfigService } from '@nestjs/config';
import { estadoConvocatoria } from 'src/enums/convocatoria.enum';
import { AuthService } from 'src/auth/auth.service';
import { UsuarioService } from 'src/usuario/usuario.service';
import { AddProjToAnnouncementDto } from './dto/addProject-to-convocatoria.dto';
import { ProyectoService } from 'src/proyecto/proyecto.service';

@Injectable()
export class ConvocatoriaService {
  constructor(
    @InjectModel(Convocatoria.name)
    private readonly convocatoriaModel: Model<Convocatoria>,
    private readonly firebaseService: FirebaseService,
    private readonly notisService: NotificacionesService,
    private readonly configService: ConfigService,
    private readonly userService: UsuarioService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(forwardRef(() => ProyectoService))
    private readonly proyectoService: ProyectoService
  ) { }

  async create(
    createConvocatoriaDto: CreateConvocatoriaDto,
    file: Express.Multer.File[],
  ): Promise<Convocatoria> {
    const newCon = new this.convocatoriaModel(createConvocatoriaDto);
    const emails = this.userService.findAllEmailsRegistered();

    const fileUploads = file.map(async (file) => {
      const fileBuffer = file.buffer;
      const fileDestination = `convocatoria/${newCon._id}/${file.originalname}`;
      const fileMymeType = file.mimetype;
      if (!fileBuffer && !fileDestination && !fileMymeType) {
        throw new BadRequestException('Invalid file upload');
      }
      await this.firebaseService.uploadFile(
        fileBuffer,
        fileDestination,
        fileMymeType,
      );

      const filesUrls = [];
      const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${this.configService.get<string>('FIREBASE_URL')}/o/${encodeURIComponent(fileDestination)}?alt=media`;
      filesUrls.push(fileUrl);
      newCon.files.push(fileUrl);
      return newCon.save();
    });

    //  Notification body
    // Send Email notification
    (await emails).forEach((email) => {
      this.authService.sendAnnouncementEmailNoti(
        email.email,
        newCon.title,
        newCon.descripcion,
      );
    });

    const title = 'Nueva convocatoria!';
    const body = 'Se ha creado una nueva convocatoria, ¡Revísala ahora!';
    this.notisService.createNotiAnnouncement({
      title,
      body,
      convocatoria: newCon.id,
      estado: notiStateEnum.NonViwed,
    });

    (await emails).forEach(async (email) => {
      const user = await this.userService.findOne(email.id);
      if (!user.deviceToken || user.deviceToken === null) {
        console.log('device token not found');
      }
      if (user.deviceToken !== null ) {
        await this.firebaseService.sendPushNotification({
          body: body,
          title: title,
          token: user.deviceToken,
        });
      }
      console.log('noti push sended');

    });

    await Promise.all(fileUploads);
    return newCon;
  }

  async findAll(): Promise<Convocatoria[]> {
    try {
      const now = new Date();
      const convs = await this.convocatoriaModel.find();
      await Promise.allSettled(
        convs.map((conv) => this.announcementFinished(conv.id, now)),
      );

      return convs;
    } catch (error) {
      throw new NotFoundException('Announcement not found');
    }
  }

  async findOne(id: Types.ObjectId) {
    try {
      const now = new Date();

      const conv = await this.convocatoriaModel.findById(id);
      await this.announcementFinished(conv.id, now);
      return conv;
    } catch (error) {
      throw new NotFoundException('Announcement not found');
    }
  }

  async findProjectInAnn(projectId: Types.ObjectId) {
    try {
      const ann = await this.convocatoriaModel.findOne({ proyectos: projectId }).select('title')
      return ann


    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async update(
    id: Types.ObjectId,
    updateConvocatoriaDto: UpdateConvocatoriaDto,
  ) {
    try {
      const conv = await this.convocatoriaModel.findByIdAndUpdate(
        id,
        updateConvocatoriaDto,
        { new: true },
      );

      return conv;
    } catch (error) {
      throw new BadRequestException('Invalid id or body');
    }
  }

  async addProjectToAnnouncement(projectId: AddProjToAnnouncementDto, announcementId: Types.ObjectId) {
    const ann = await this.convocatoriaModel.findById(announcementId);

    if (!ann) {
      throw new NotFoundException('Announcement not found')
    }
    const projId = String(projectId.proyecto);

    const project = await this.proyectoService.findOne(projId);
    if (!project) {
      throw new NotFoundException('Proyecto no encontrado')
    }

    if (project.convocatoria) {
      throw new BadRequestException('Este proyecto ya está en una convocatoria')
    }

    if (ann.proyectos.includes(projectId.proyecto)) {
      throw new BadRequestException(`Este proyecto está en la convocatoria ${ann.title}`)
    }

    ann.proyectos.push(projectId.proyecto);
    await ann.save();

    project.convocatoria = ann
    await project.save();

    return ann;
  }

  async announcementFinished(id: Types.ObjectId, now: Date) {
    try {
      const announcement = await this.convocatoriaModel.findByIdAndUpdate(id);

      if (!announcement) {
        throw new NotFoundException('Announcement not found');
      }

      if (now >= announcement.fechaCierre) {
        announcement.estado = estadoConvocatoria.FINALIZED;
        await announcement.save();
        return {
          message: `Convocatoria ${announcement.title} ha sido finalizada`,
        };
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: Types.ObjectId) {
    try {
      const delConv = await this.convocatoriaModel.findByIdAndDelete(id);
      return delConv;
    } catch (error) {
      throw new NotFoundException('Announcement not found');
    }
  }
}
