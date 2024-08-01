import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConvocatoriaDto } from './dto/create-convocatoria.dto';
import { UpdateConvocatoriaDto } from './dto/update-convocatoria.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Convocatoria } from './schema/convocatoria.entity';
import { Model, Types } from 'mongoose';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class ConvocatoriaService {
  constructor(
    @InjectModel(Convocatoria.name)
    private readonly convocatoriaModel: Model<Convocatoria>,
    private readonly firebaseService: FirebaseService,
  ) {}

  async create(createConvocatoriaDto: CreateConvocatoriaDto, headers: any) {
    const newCon = new this.convocatoriaModel(createConvocatoriaDto);
    await newCon.save();

    const token = headers['device-token'];
    if (!token) {
      throw new NotFoundException('Device token not found');
    }
    const title = 'Nueva convocatoria!';
    const body = 'Se ha creado una nueva convocatoria, ¡Revísala ahora!';
    await this.firebaseService.sendPushNotification(token, title, body);
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
