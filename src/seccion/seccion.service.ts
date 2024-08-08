import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
    try {
          const newSec = new this.seccionModel(createSeccionDto);
          const secc = await newSec.save();

          await this.projectService.addSeccionToProject(
            createSeccionDto.proyecto,
            secc.id,
          );
          return secc.populate('proyecto');
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll(): Promise<Seccion[]> {
    try {
          const Seccs = await this.seccionModel
            .find()
            .populate('proyecto')
            .exec();
          return Seccs;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async findOne(id: string) {
    try {
          const Secc = await this.seccionModel
            .findById(id)
            .populate('proyecto')
            .exec();
          return Secc;
    } catch (error) {
      throw new NotFoundException('not found coso');
    }
  }

  async update(id: string, updateSeccionDto: UpdateSeccionDto) {
    try {
          const newSecc = await this.seccionModel
            .findByIdAndUpdate(id, updateSeccionDto, {
              new: true,
            })
            .populate('proyecto')
            .exec();
          return newSecc;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: string) {
    try {
          const delSecc = await this.seccionModel.findByIdAndDelete(id);
          return delSecc;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
}
