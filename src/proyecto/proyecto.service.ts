import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Proyecto } from './schema/proyecto.shema';

@Injectable()
export class ProyectoService {
  constructor(
    @InjectModel(Proyecto.name) private proyectoModel: Model<Proyecto>,
  ) {}

  async findAll(): Promise<Proyecto[]> {
    return this.proyectoModel.find().exec();
  }

  async findOne(id: string): Promise<Proyecto> {
    return this.proyectoModel.findById(id).exec();
  }

  async create(proyecto: Proyecto): Promise<Proyecto> {
    const createdProyecto = new this.proyectoModel(proyecto);
    return createdProyecto.save();
  }

  async update(id: string, proyecto: Proyecto): Promise<Proyecto> {
    return this.proyectoModel.findByIdAndUpdate(id, proyecto, { new: true }).exec();
  }

  async remove(id: string): Promise<any> {
    return this.proyectoModel.findByIdAndDelete(id).exec();
  }
}