import { Injectable } from '@nestjs/common';
import { CreateConvocatoriaDto } from './dto/create-convocatoria.dto';
import { UpdateConvocatoriaDto } from './dto/update-convocatoria.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Convocatoria } from './schema/convocatoria.entity';
import { Model, ObjectId } from 'mongoose';

@Injectable()
export class ConvocatoriaService {
  constructor(
    @InjectModel(Convocatoria.name)
    private readonly convocatoriaModel: Model<Convocatoria>,
  ) {}

  async create(createConvocatoriaDto: CreateConvocatoriaDto) {
    const newCon = new this.convocatoriaModel(createConvocatoriaDto);
    await newCon.save();
    return newCon;
  }

  async findAll(): Promise<Convocatoria[]> {
    const convs = await this.convocatoriaModel.find()
    return convs;
  }

  async findOne(id: ObjectId) {
    const conv = await this.convocatoriaModel.findById(id)
    return conv;
  }

  async update(id: ObjectId, updateConvocatoriaDto: UpdateConvocatoriaDto) {
    const conv = await this.convocatoriaModel.findByIdAndUpdate(id, updateConvocatoriaDto);
    return conv;
  }

  async remove(id: ObjectId) {
    const delConv = await this.convocatoriaModel.findByIdAndDelete(id);
    return delConv;
  }
}
