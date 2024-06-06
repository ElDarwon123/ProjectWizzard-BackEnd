import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario } from './schema/usuario.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectModel('Usuario') private readonly usuarioModel: Model<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const newUser = new this.usuarioModel(createUsuarioDto);
    await newUser.save();
    return newUser.populate('role');
  }

  async findAll(): Promise<Usuario[]> {
    const usuarios = await this.usuarioModel.find().populate('role').exec();
    return usuarios;
  }

  async findOne(id: string) {
    const user = await this.usuarioModel.findById(id).populate('role').exec();
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.usuarioModel
      .findOne({ email })
      .populate('role')
      .exec();
    return user;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const updateUser = (
      await this.usuarioModel.findByIdAndUpdate(id, updateUsuarioDto, {
        new: true,
      })
    )
      .populated('role')
      .exec();
    return updateUser;
  }

  async remove(id: string) {
    const delUser = await this.usuarioModel.findByIdAndDelete(id).exec();
    return delUser;
  }
}
