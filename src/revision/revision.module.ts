import { Module } from '@nestjs/common';
import { RevisionService } from './revision.service';
import { RevisionController } from './revision.controller';
import { SharedModule } from 'src/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [RevisionController],
  providers: [RevisionService],
})
export class RevisionModule {}
