import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './schema/role.schema';
import { Model } from 'mongoose';


@Injectable()
export class RoleService {

  constructor(@InjectModel('Role') private readonly roleModel: Model<Role>) {}

  // create a role
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const newRole = await  this.roleModel.create(createRoleDto)
    return newRole.save();
  }
  // fetch all roles
  async findAll(): Promise<Role[]>{
    const roles = await this.roleModel.find();
    return roles;
  }
  // fetch one rol by its id
  async findOne(id: string) {
    const rol = await this.roleModel.findById(id)
    return rol;
  }
  // update a role by id and using updateDto
  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const updateRol = await this.roleModel.findByIdAndUpdate(id, updateRoleDto)
    return updateRol;
  }
  // delete a role by id
  async remove(id: string) {
    const delRol = await this.roleModel.findByIdAndDelete(id)
    return delRol;
  }
}
