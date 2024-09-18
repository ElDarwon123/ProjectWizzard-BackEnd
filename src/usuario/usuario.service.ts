import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model, ObjectId, Types } from 'mongoose';
import { Usuario } from './schema/usuario.schema';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { FirebaseService } from 'src/firebase/firebase.service';
import * as moment from 'moment';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectModel(Usuario.name) private readonly usuarioModel: Model<Usuario>,
    @Inject() private readonly configService: ConfigService,
    private readonly firebaseService: FirebaseService,
    private readonly jwtService: JwtService,
  ) {}

  async create(
    createUsuarioDto: CreateUsuarioDto,
    imageBuffer: Buffer,
    imageDestination: string,
    imageMymetype: string,
  ): Promise<Usuario> {
    try {
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
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async howManyProjects(token: string) {
    try {
      const decoded = await this.jwtService.decode(token);
      const userId = decoded.sub._id;

      if (!decoded) {
        throw new BadRequestException('Invalid token');
      }
      if (!userId) {
        throw new NotFoundException('User not found');
      }

      const user = await this.usuarioModel.findById(userId);
      const cantidad = user.proyectos.length
      
      return cantidad

    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async addProyectoToUser(
    userId: ObjectId,
    proyectoId: ObjectId,
  ): Promise<Usuario> {
    try {
      const user = await this.usuarioModel.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      user.proyectos.push(proyectoId);
      await user.save();

      return user;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll(): Promise<Usuario[]> {
    try {
      return this.usuarioModel.find().populate('proyectos').exec();
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async findOne(id: string) {
    try {
      return this.usuarioModel.findById(id, {}, {timestamps: true}).populate('proyectos');
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async findUserForToken(email: string) {
    try {
      const user = await this.usuarioModel
        .findOne({ email: email })
        .select(['nombre', 'email', 'fechaNacimiento', 'contrasena', 'role'])
        .exec();
      return user
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async countUsersPerDayThisWeek(): Promise<{ [key: string]: number }> {
    const startOfWeek = moment().startOf("isoWeek").toDate(); // current week monday
    const endOfWeek = moment().endOf("isoWeek").toDate(); // current week sunday

    const users = await this.usuarioModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfWeek, $lte: endOfWeek },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum : 1 },
        },
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    const dailyCount: { [ key: string ]: number } = {};

    users.forEach((user)=> {
      dailyCount[user._id] = user.count;
    });

    return dailyCount;
}

  async HowManyUsers(): Promise<number> {
    const users = await this.usuarioModel.find();
  
    return users.length;
  }

  async update(
    id: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    try {
      const existingUser = await this.usuarioModel.findOne({
        email: updateUsuarioDto.email,
      });
      if (existingUser) {
        throw new ConflictException('Email already registered');
      }
      return this.usuarioModel.findByIdAndUpdate(id, updateUsuarioDto, {
        new: true,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: Types.ObjectId) {
    try {
      return this.usuarioModel.findByIdAndDelete(id);
    } catch (error) {
      throw new NotFoundException(error);
    }
  }
}
