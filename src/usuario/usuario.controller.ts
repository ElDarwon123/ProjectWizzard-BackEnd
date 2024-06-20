import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AuthGuard } from 'src/auth/auth.guard';
//import { Roles } from 'src/decorators/roles.decorator';
//import { RolesGuard } from 'src/role/role.guard';

@Controller('auth/usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}
  @UseGuards(AuthGuard)
  
  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }
  @UseGuards(AuthGuard)
  
  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }
  @UseGuards(AuthGuard)
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(id);
  }
  @UseGuards(AuthGuard)
  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.update(id, updateUsuarioDto);
  }
  @UseGuards(AuthGuard)
  
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(id);
  }
}
