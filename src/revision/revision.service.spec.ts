import { Test, TestingModule } from '@nestjs/testing';
import { RevisionService } from './revision.service';

describe('RevisionService', () => {
  let service: RevisionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RevisionService],
    }).compile();

    service = module.get<RevisionService>(RevisionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
