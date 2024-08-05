import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConvocatoriaDto } from './dto/create-convocatoria.dto';
import { UpdateConvocatoriaDto } from './dto/update-convocatoria.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Convocatoria } from './schemas/convocatoria.entity';
import { Model, Types } from 'mongoose';
import { FirebaseService } from 'src/firebase/firebase.service';
import { Request } from 'express';
import { NotificacionesService } from 'src/notificaciones/notificaciones.service';

@Injectable()
export class ConvocatoriaService {
  constructor(
    @InjectModel(Convocatoria.name)
    private readonly convocatoriaModel: Model<Convocatoria>,
    private readonly firebaseService: FirebaseService,
    private readonly notisService: NotificacionesService,
  ) {}

  async create(createConvocatoriaDto: CreateConvocatoriaDto) {
    const newCon = new this.convocatoriaModel(createConvocatoriaDto);
    await newCon.save();

    const title = 'Nueva convocatoria!';
    const body = 'Se ha creado una nueva convocatoria, ¡Revísala ahora!';
    const url = `https://project-wizzard-react-1ea9hjmqv-neukkkens-projects.vercel.app/convocatoria?id=${newCon.id}`;
    this.notisService.createNotiAnnouncement({
      title,
      body,
      url,
      convocatoria: newCon.id
    })
    return newCon;
  }

  async findAll(): Promise<Convocatoria[]> {
    const convs = await this.convocatoriaModel.find();
    return convs;
  }

  async findOne(id: Types.ObjectId) {
    const conv = await this.convocatoriaModel.findById(id);
    return conv;
  }

  async update(
    id: Types.ObjectId,
    updateConvocatoriaDto: UpdateConvocatoriaDto,
  ) {
    const conv = await this.convocatoriaModel.findByIdAndUpdate(
      id,
      updateConvocatoriaDto,
      { new: true },
    );
    return conv;
  }

  async remove(id: Types.ObjectId) {
    const delConv = await this.convocatoriaModel.findByIdAndDelete(id);
    return delConv;
  }
}
