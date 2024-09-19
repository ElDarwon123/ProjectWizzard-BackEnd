import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateConvocatoriaDto } from './dto/create-convocatoria.dto';
import { UpdateConvocatoriaDto } from './dto/update-convocatoria.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Convocatoria } from './schemas/convocatoria.entity';
import { Model, Types } from 'mongoose';
import { FirebaseService } from 'src/firebase/firebase.service';
import { NotificacionesService } from 'src/notificaciones/notificaciones.service';
import { notiStateEnum } from 'src/enums/estado-noti.enum';
import { ConfigService } from '@nestjs/config';
import { estadoConvocatoria } from 'src/enums/convocatoria.enum';
import { AuthService } from 'src/auth/auth.service';
import { UsuarioService } from 'src/usuario/usuario.service';

@Injectable()
export class ConvocatoriaService {
  constructor(
    @InjectModel(Convocatoria.name)
    private readonly convocatoriaModel: Model<Convocatoria>,
    private readonly firebaseService: FirebaseService,
    private readonly notisService: NotificacionesService,
    private readonly configService: ConfigService,
    private readonly userService: UsuarioService,
    private readonly authService: AuthService,
  ) {}

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
      } else {
        this.firebaseService.sendPushNotification({
          body: body,
          title: title,
          token: user.deviceToken,
        });

        console.log('noti push sended');
      }
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
