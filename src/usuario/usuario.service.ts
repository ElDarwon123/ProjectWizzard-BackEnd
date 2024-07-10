import { ConflictException, Injectable } from '@nestjs/common';
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

  async findAll(): Promise<Usuario[]> {
    const usuarios = await this.usuarioModel.find();
    return usuarios;
  }

  async findOne(id: string) {
    const user = await this.usuarioModel.findById(id);
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.usuarioModel
      .findOne({ email })
    return user;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const existingUser = await this.usuarioModel.findOne({
      email: updateUsuarioDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }
    const updateUser = (
      await this.usuarioModel.findByIdAndUpdate(id, updateUsuarioDto, {
        new: true,
      })
    );
    return updateUser;
  }

  async remove(id: string) {
    const delUser = await this.usuarioModel.findByIdAndDelete(id);
    return delUser;
  }


}
