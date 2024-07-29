import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Usuario } from './schema/usuario.schema';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const existingUser = await this.usuarioModel.findOne({
      email: createUsuarioDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }
    const newUser = new this.usuarioModel(createUsuarioDto);
    await newUser.save();
    return newUser;
  }

  async addProyectoToUser(
    userId: string,
    proyectoId: string,
  ): Promise<Usuario> {
    const user = await this.usuarioModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.proyectos.push(proyectoId);
    await user.save();

    return user;
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioModel.find().populate('proyectos').exec();
  }

  async findOne(id: string) {
    return this.usuarioModel.findById(id).populate('proyectos').exec();
  }

  async findByEmail(email: string) {
    return this.usuarioModel.findOne({ email }).populate('proyectos').exec();
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const existingUser = await this.usuarioModel.findOne({
      email: updateUsuarioDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }
    return this.usuarioModel.findByIdAndUpdate(id, updateUsuarioDto, {
      new: true,
    });
  }

  async remove(id: string) {
    return this.usuarioModel.findByIdAndDelete(id);
  }
}
