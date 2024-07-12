import { Injectable } from '@nestjs/common';
import { CreateRevisionDto } from './dto/create-revision.dto';
import { UpdateRevisionDto } from './dto/update-revision.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Revision } from './schema/revision.schema';
import { Model } from 'mongoose';

@Injectable()
export class RevisionService {
  constructor(
    @InjectModel(Revision.name) private readonly revisionModel: Model<Revision>,
  ) {}

  async create(createRevisionDto: CreateRevisionDto) {
    const newRev = await new this.revisionModel(createRevisionDto);
    newRev.save();
    return newRev.populate(['usuario', 'seccion']);
  }

  async findAll(): Promise<Revision[]> {
    const revisions = await this.revisionModel
      .find()
      .populate(['usuario', 'seccion']);
    return revisions;
  }

  async findOne(id: string) {
    const revision = await this.revisionModel
      .findById(id)
      .populate(['usuario', 'seccion']);
    return revision;
  }

  async update(id: string, updateRevisionDto: UpdateRevisionDto) {
    const newRev = await this.revisionModel
      .findByIdAndUpdate(id, updateRevisionDto, { new: true })
      .populate(['usuario', 'seccion']);
    return newRev;
  }

  async remove(id: string) {
    const deleteRev = await this.revisionModel.findByIdAndDelete(id);
    return deleteRev;
  }
}
