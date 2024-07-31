import { Injectable } from '@nestjs/common';
import { CreateSeccionDto } from './dto/create-seccion.dto';
import { UpdateSeccionDto } from './dto/update-seccion.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Seccion } from './schema/seccion.schema';
import { Model } from 'mongoose';
import { ProyectoService } from 'src/proyecto/proyecto.service';

@Injectable()
export class SeccionService {
  constructor(
    @InjectModel(Seccion.name) private readonly seccionModel: Model<Seccion>,
    private readonly projectService: ProyectoService,
  ) {}

  async create(createSeccionDto: CreateSeccionDto) {
    const newSec = new this.seccionModel(createSeccionDto);
    const secc = await newSec.save();

    await this.projectService.addSeccionToProject(
      createSeccionDto.proyecto,
      secc.id,
    );
    return secc.populate('proyecto');
  }

  async findAll(): Promise<Seccion[]> {
    const Seccs = await this.seccionModel.find().populate('proyecto').exec();
    return Seccs;
  }

  async findOne(id: string) {
    const Secc = await this.seccionModel
      .findById(id)
      .populate('proyecto')
      .exec();
    return Secc;
  }

  async update(id: string, updateSeccionDto: UpdateSeccionDto) {
    const newSecc = await this.seccionModel
      .findByIdAndUpdate(id, updateSeccionDto, {
        new: true,
      })
      .populate('proyecto')
      .exec();
    return newSecc;
  }

  async remove(id: string) {
    const delSecc = await this.seccionModel.findByIdAndDelete(id);
    return delSecc;
  }
}
