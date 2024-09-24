import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Proyecto } from './schema/proyecto.shema';
import { CreateProyectoDto } from './dtos/create.proyecto.dto';
import { UpdateProyectoDto } from './dtos/update-proyecto.dto';
import { UsuarioService } from 'src/usuario/usuario.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { ConfigService } from '@nestjs/config';
import { NotificacionesService } from 'src/notificaciones/notificaciones.service';
import { EstadoProyecto } from 'src/enums/estado-proyecto.enum';
import { AuthService } from 'src/auth/auth.service';
import { forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { notiStateEnum } from 'src/enums/estado-noti.enum';
import * as moment from 'moment';
import { ConvocatoriaService } from 'src/convocatoria/convocatoria.service';

@Injectable()
export class ProyectoService {
  constructor(
    @InjectModel(Proyecto.name) private proyectoModel: Model<Proyecto>,
    private readonly usuarioService: UsuarioService,
    private readonly firebaseService: FirebaseService,
    private readonly notiService: NotificacionesService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly convService: ConvocatoriaService,
  ) { }

  // ======== GET METHODS ======== //

  // == GET ALL METHOD ==
  async findAll(): Promise<Proyecto[]> {
    const projects = await this.proyectoModel
      .find()
      .populate(['usuarioId', 'secciones', 'revisiones'])
      .exec();

    const filteredProj = projects.filter(async (proj) => {
      if (proj.usuarioId === null) {
        await this.proyectoModel.findByIdAndDelete(proj._id);
      }
      return (proj && proj.usuarioId !== null)
    });
    return filteredProj;
  }
  // == GET USER PROJECTS ==
  async findUserProjects(token: string): Promise<Proyecto[]> {
    let user: string;
    try {
      const decoded = await this.jwtService.decode(token);
      user = decoded.sub._id;

      const projects = await this.proyectoModel
        .find()
        .populate(['usuarioId', 'secciones', 'revisiones', 'convocatoria'])
        .exec();

      const filteredProjects = projects.filter((project) => {
        return project.usuarioId && project.usuarioId._id.toString() === user;
      });

      return filteredProjects;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  async findActives(token: string): Promise<Proyecto[]> {
    let user: string;
    try {
      const decoded = await this.jwtService.decode(token);
      user = decoded.sub._id;

      const filtered = await this.proyectoModel.find({ usuarioId: user });

      filtered.filter((proj) => {
        const projFiltered =
          proj.estado === EstadoProyecto.EN_PROGRESO ||
          EstadoProyecto.EN_REVISION ||
          EstadoProyecto.PENDIENTE ||
          EstadoProyecto.REViSADO_ERRORES;
        return projFiltered;
      });
      return filtered;
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

  async getProjectsByState(target: string) {
    const totalProjects = await this.proyectoModel.countDocuments();

    if (totalProjects === 0) {
      return {
        message: 'No hay proyectos',
      };
    }

    const stOnReview = await this.proyectoModel.countDocuments({
      estado: EstadoProyecto.EN_REVISION,
    });
    const stComplete = await this.proyectoModel.countDocuments({
      estado: EstadoProyecto.COMPLETADO,
    });
    const stInProgress = await this.proyectoModel.countDocuments({
      estado: EstadoProyecto.EN_PROGRESO,
    });
    const stPending = await this.proyectoModel.countDocuments({
      estado: EstadoProyecto.PENDIENTE,
    });
    const stRefused = await this.proyectoModel.countDocuments({
      estado: EstadoProyecto.RECHAZADO,
    });
    const stReviewed = await this.proyectoModel.countDocuments({
      estado: EstadoProyecto.REVISADO,
    });
    const stReviewedWithErrors = await this.proyectoModel.countDocuments({
      estado: EstadoProyecto.REViSADO_ERRORES,
    });

    switch (target) {
      case 'percents':
        const STOR = (stOnReview / totalProjects) * 100;
        const STCOM = (stComplete / totalProjects) * 100;
        const STIP = (stInProgress / totalProjects) * 100;
        const STPEN = (stPending / totalProjects) * 100;
        const STREF = (stRefused / totalProjects) * 100;
        const STREV = (stReviewed / totalProjects) * 100;
        const STREVERR = (stReviewedWithErrors / totalProjects) * 100;

        return {
          EN_REVISION: STOR,
          COMPLETADOS: STCOM,
          EN_PROGRESO: STIP,
          PENDIENTE: STPEN,
          RECHAZADOS: STREF,
          REVISADOS: STREV,
          REVISADOS_ERRORES: STREVERR,
          TOTAL_PROYECTOS: totalProjects,
        };
      case 'integers':
        return {
          EN_REVISION: stOnReview,
          COMPLETADOS: stComplete,
          EN_PROGRESO: stInProgress,
          PENDIENTE: stPending,
          RECHAZADOS: stRefused,
          REVISADOS: stReviewed,
          REVISADOS_ERRORES: stReviewedWithErrors,
          TOTAL_PROYECTOS: totalProjects,
        };
      default:
        return {
          message: 'No Projects',
        };
    }
  }

  async countProjectsPerDayThisWeek(): Promise<{ [key: string]: number }> {
    const startOfWeek = moment().startOf("isoWeek").toDate(); // current week monday
    const endOfWeek = moment().endOf("isoWeek").toDate(); // current week sunday

    const projs = await this.proyectoModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfWeek, $lte: endOfWeek },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    const dailyCount: { [key: string]: number } = {};

    projs.forEach((proj) => {
      dailyCount[proj._id] = proj.count;
    });

    return dailyCount;
  }

  // ==== GET BY ID METHOD ====
  async findOne(id: string): Promise<Proyecto> {
    const proyecto = await this.proyectoModel
      .findById(id)
      .populate(['usuarioId', 'secciones', 'revisiones', {path: 'convocatoria', select: ['title', 'estado']}])
      .exec();
    if (!proyecto) {
      throw new NotFoundException(`Proyecto with ID ${id} not found`);
    }
    return proyecto;
  }

  // ==== CREATE METHODS ====

  async create(
    createProyectoDto: CreateProyectoDto,
    imageBuffer?: Buffer,
    imageDestination?: string,
    imageMymeType?: string,
  ): Promise<Proyecto> {
    if (imageBuffer && imageDestination && imageMymeType) {
      await this.firebaseService.uploadFile(
        imageBuffer,
        imageDestination,
        imageMymeType,
      );
      createProyectoDto.image = `https://firebasestorage.googleapis.com/v0/b/${this.configService.get<string>('FIREBASE_URL')}/o/${encodeURIComponent(imageDestination)}?alt=media`;
    }

    const createdProyecto = new this.proyectoModel(createProyectoDto);

    const proyecto = await createdProyecto.save();

    // se añade proyecto a usuario
    await this.usuarioService.addProyectoToUser(
      createProyectoDto.usuarioId,
      proyecto.id,
    );

    // notification body
    const title = 'Se ha subido un nuevo proyecto!';
    const body = 'Ha llegado un nuevo proyecto al gremio, vamos a revisarlo!';
    const url = proyecto.id;

    await this.notiService.createNotiProject({
      title,
      body,
      proyecto: proyecto.id,
      url,
      estado: notiStateEnum.NonViwed,
    });

    return proyecto;
  }

  // ==== ADDERs METHOD ====

  async addFileToProject(
    projectId: ObjectId,
    files: Express.Multer.File[],
  ): Promise<void> {
    const proj = await this.proyectoModel.findById(projectId);
    if (!proj) {
      throw new NotFoundException('Project not found');
    }
    const fileUploads = files.map(async (file) => {
      const buffer = file.buffer;
      const destination = `projects/${projectId}/${file.originalname}`;
      const mymetype = file.mimetype;

      if (!buffer || !mymetype || !destination) {
        throw new BadRequestException('Invalid file data');
      }

      await this.firebaseService.uploadFile(buffer, destination, mymetype);
      const fileUrl = `https://firebasestorage.googleapis.com/v0/b/${this.configService.get<string>('FIREBASE_URL')}/o/${encodeURIComponent(destination)}?alt=media`;
      proj.files.push(fileUrl);
      await proj.save();
      return proj;
    });
    await Promise.all(fileUploads);
  }

  async addSeccionToProject(
    projectId: ObjectId,
    seccionId: ObjectId,
  ): Promise<Proyecto> {
    const proj = await this.proyectoModel.findById(projectId);
    if (!proj) {
      throw new NotFoundException('Project not found');
    }

    proj.secciones.push(seccionId);
    await proj.save();
    return proj;
  }

  async addRevisionToProject(
    projectId: ObjectId,
    revisionId: ObjectId,
  ): Promise<Proyecto> {
    const proj = await this.proyectoModel.findById(projectId);
    if (!proj) {
      throw new NotFoundException('Project not found');
    }
    proj.revisiones.push(revisionId);

    await proj.save();
    return proj;
  }

  // ==== UPDATE METHOD ====

  async update(
    id: string,
    updateProyectoDto: UpdateProyectoDto,
  ): Promise<Proyecto> {
    const updatedProyecto = await this.proyectoModel
      .findByIdAndUpdate(id, updateProyectoDto, { new: true })
      .populate({
        path: 'usuarioId',
      })
      .exec();
    if (!updatedProyecto) {
      throw new NotFoundException(`Proyecto not found`);
    }
    if (updatedProyecto.usuarioId.notificaciones === true) {
      const userEmail = updatedProyecto.usuarioId.email;
      await this.authService.sendNotificationEmail(
        userEmail,
        updatedProyecto.id,
      );
    };
    if (
      updatedProyecto.estado === EstadoProyecto.EN_REVISION ||
      updatedProyecto.estado === EstadoProyecto.REVISADO ||
      updatedProyecto.estado === EstadoProyecto.COMPLETADO ||
      updatedProyecto.estado === EstadoProyecto.RECHAZADO
    ) {
      const title = `Tu Proyecto ${updatedProyecto.titulo} fue Juzgado!`;
      const body = `Tu proyecto ha sido juzgado por los magos, ellos dicen que está ${updatedProyecto.estado}, mira que más han dicho de tu proyecto.`;
      const url = `https://project-wizzard-react-1ea9hjmqv-neukkkens-projects.vercel.app/administrador/review?id=${updatedProyecto.id}`;
      await this.notiService.createNotiProject({
        title,
        body,
        url,
        proyecto: updatedProyecto.id,
        estado: notiStateEnum.NonViwed,
      });
      await this.firebaseService.sendPushNotification({
        title: title, 
        body: body, 
        token: updatedProyecto.usuarioId.deviceToken,
      })
      return updatedProyecto;
    }
    return updatedProyecto;
  }

  // ==== DELETE METHOD ====

  async remove(id: string): Promise<Proyecto> {
    const deletedProyecto = await this.proyectoModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedProyecto) {
      throw new NotFoundException(`Proyecto with ID ${id} not found`);
    }
    return deletedProyecto;
  }
}
