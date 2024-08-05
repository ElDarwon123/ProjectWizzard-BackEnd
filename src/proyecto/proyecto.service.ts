import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { Proyecto } from './schema/proyecto.shema';
import { CreateProyectoDto } from './dtos/create.proyecto.dto';
import { UpdateProyectoDto } from './dtos/update-proyecto.dto';
import { UsuarioService } from 'src/usuario/usuario.service';
import { FirebaseService } from 'src/firebase/firebase.service';
import { File } from '../files/schemas/file.schema';
import { ConfigService } from '@nestjs/config';
import { buffer } from 'stream/consumers';
import { NotificacionesService } from 'src/notificaciones/notificaciones.service';
import { Body } from '@nestjs/common';
import { EstadoProyecto } from 'src/enums/estado-proyecto.enum';

@Injectable()
export class ProyectoService {
  constructor(
    @InjectModel(Proyecto.name) private proyectoModel: Model<Proyecto>,
    private readonly usuarioService: UsuarioService,
    private readonly firebaseService: FirebaseService,
    private readonly notiService: NotificacionesService,
    @Inject() private readonly configService: ConfigService,
  ) {}

  async findAll(): Promise<Proyecto[]> {
    return this.proyectoModel
      .find()
      .populate(['usuarioId', 'secciones', 'revisiones'])
      .exec();
  }

  async findOne(id: string): Promise<Proyecto> {
    const proyecto = await this.proyectoModel
      .findById(id)
      .populate(['usuarioId', 'secciones', 'revisiones'])
      .exec();
    if (!proyecto) {
      throw new NotFoundException(`Proyecto with ID ${id} not found`);
    }
    return proyecto;
  }

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

    return proyecto;
  }
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

  async update(
    id: string,
    updateProyectoDto: UpdateProyectoDto,
  ): Promise<Proyecto> {
    const updatedProyecto = await this.proyectoModel
      .findByIdAndUpdate(id, updateProyectoDto, { new: true })
      .exec();
    if (!updatedProyecto) {
      throw new NotFoundException(`Proyecto not found`);
    }
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
      });
      return updatedProyecto;
    }
    return updatedProyecto;
  }

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
