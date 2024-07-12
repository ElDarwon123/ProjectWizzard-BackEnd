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
import { RevisionService } from './revision.service';
import { CreateRevisionDto } from './dto/create-revision.dto';
import { UpdateRevisionDto } from './dto/update-revision.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesEnum } from 'src/enums/role.enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Revision')
@Controller('revision')
export class RevisionController {
  constructor(private readonly revisionService: RevisionService) {}

  @Roles(RolesEnum.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  create(@Body() createRevisionDto: CreateRevisionDto) {
    return this.revisionService.create(createRevisionDto);
  }

  @Roles(RolesEnum.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Get()
  findAll() {
    return this.revisionService.findAll();
  }

  @Roles(RolesEnum.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.revisionService.findOne(id);
  }

  @Roles(RolesEnum.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRevisionDto: UpdateRevisionDto,
  ) {
    return this.revisionService.update(id, updateRevisionDto);
  }

  @Roles(RolesEnum.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.revisionService.remove(id);
  }
}
