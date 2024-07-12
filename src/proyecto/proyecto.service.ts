import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Proyecto } from './schema/proyecto.shema';
import { CreateProyectoDto } from './dtos/create.proyecto.dto';
import { UpdateProyectoDto } from './dtos/update-proyecto.dto';
import { UsuarioService } from 'src/usuario/usuario.service';

@Injectable()
export class ProyectoService {
  constructor(
    @InjectModel(Proyecto.name) private proyectoModel: Model<Proyecto>,
    private readonly usuarioService: UsuarioService,
  ) { }

  async findAll(): Promise<Proyecto[]> {
    return this.proyectoModel.find().populate('usuarioId').exec();
  }

  async findOne(id: string): Promise<Proyecto> {
    const proyecto = await this.proyectoModel.findById(id).populate('usuarioId').exec();
    if (!proyecto) {
      throw new NotFoundException(`Proyecto with ID ${id} not found`);
    }
    return proyecto;
  }

  async create(createProyectoDto: CreateProyectoDto): Promise<Proyecto> {
    const createdProyecto = new this.proyectoModel(createProyectoDto);
    return createdProyecto.save();
  }

  async update(id: string, updateProyectoDto: UpdateProyectoDto): Promise<Proyecto> {
    const updatedProyecto = await this.proyectoModel.findByIdAndUpdate(id, updateProyectoDto, { new: true }).exec();
    if (!updatedProyecto) {
      throw new NotFoundException(`Proyecto with ID ${id} not found`);
    }
    return updatedProyecto;
  }

  async remove(id: string): Promise<Proyecto> {
    const deletedProyecto = await this.proyectoModel.findByIdAndDelete(id).exec();
    if (!deletedProyecto) {
      throw new NotFoundException(`Proyecto with ID ${id} not found`);
    }
    return deletedProyecto;
  }
}
