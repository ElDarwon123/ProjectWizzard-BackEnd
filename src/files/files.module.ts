import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { SharedModule } from 'src/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
