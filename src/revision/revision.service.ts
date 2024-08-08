import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRevisionDto } from './dto/create-revision.dto';
import { UpdateRevisionDto } from './dto/update-revision.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Revision } from './schema/revision.schema';
import { Model } from 'mongoose';
import { ProyectoService } from 'src/proyecto/proyecto.service';

@Injectable()
export class RevisionService {
  constructor(
    @InjectModel(Revision.name) private readonly revisionModel: Model<Revision>,
    private readonly projectService: ProyectoService,
  ) {}

  async create(createRevisionDto: CreateRevisionDto) {
    try {
      const newRev = await new this.revisionModel(createRevisionDto);
      newRev.save();

      await this.projectService.addRevisionToProject(
        createRevisionDto.proyecto,
        newRev.id,
      );
      return newRev.populate(['usuario', 'seccion', 'proyecto']);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll(): Promise<Revision[]> {
    try {
      const revisions = await this.revisionModel
        .find()
        .populate(['usuario', 'seccion', 'proyecto']);
      return revisions;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async findOne(id: string) {
    try {
      const revision = await this.revisionModel
        .findById(id)
        .populate(['usuario', 'seccion', 'proyecto']);
      return revision;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }

  async update(id: string, updateRevisionDto: UpdateRevisionDto) {
    try {
      const newRev = await this.revisionModel
        .findByIdAndUpdate(id, updateRevisionDto, { new: true })
        .populate(['usuario', 'seccion', 'proyecto']);
      return newRev;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: string) {
    try {
      const deleteRev = await this.revisionModel.findByIdAndDelete(id);
      return deleteRev;
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
}
