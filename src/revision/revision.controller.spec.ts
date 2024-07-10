import { Test, TestingModule } from '@nestjs/testing';
import { RevisionController } from './revision.controller';
import { RevisionService } from './revision.service';

describe('RevisionController', () => {
  let controller: RevisionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RevisionController],
      providers: [RevisionService],
    }).compile();

    controller = module.get<RevisionController>(RevisionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
