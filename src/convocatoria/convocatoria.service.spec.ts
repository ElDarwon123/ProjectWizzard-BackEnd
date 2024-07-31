import { Test, TestingModule } from '@nestjs/testing';
import { ConvocatoriaService } from './convocatoria.service';

describe('ConvocatoriaService', () => {
  let service: ConvocatoriaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConvocatoriaService],
    }).compile();

    service = module.get<ConvocatoriaService>(ConvocatoriaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
