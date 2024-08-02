import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { Usuario } from './schema/usuario.schema';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UpdateDeviceTokenDto } from './dto/update-deviceToken.dto';
import { ConfigService } from '@nestjs/config';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<Usuario>,
    @Inject() private readonly configService: ConfigService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async create(
    createUsuarioDto: CreateUsuarioDto,
    imageBuffer: Buffer,
    imageDestination: string,
    imageMymetype: string,
  ): Promise<Usuario> {
    if (imageBuffer || imageDestination || imageMymetype) {
      await this.firebaseService.uploadFile(
        imageBuffer,
        imageDestination,
        imageMymetype,
      );
      createUsuarioDto.image = `https://firebasestorage.googleapis.com/v0/b/${this.configService.get<string>('FIREBASE_URL')}/o/${encodeURIComponent(imageDestination)}?alt=media`;
    }

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
    userId: ObjectId,
    proyectoId: ObjectId,
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

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
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

  async getAllTokenFCM(): Promise<string[]> {
    const users = await this.usuarioModel.find({ fcmToken: { $exists: true } }).select('fcmToken');
    return users.map(user => user.fcmToken).filter(token => !!token);
  }

  async updateDeviceToken(
    id: Types.ObjectId,
    deviceToken: UpdateDeviceTokenDto,
  ) {
    const upDevice = await this.usuarioModel
      .findByIdAndUpdate(id, { deviceToken }, { new: true })
      .exec();
    return upDevice;
  }

  async remove(id: Types.ObjectId) {
    return this.usuarioModel.findByIdAndDelete(id);
  }
}
