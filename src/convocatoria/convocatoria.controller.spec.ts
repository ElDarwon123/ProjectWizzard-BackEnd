import { Test, TestingModule } from '@nestjs/testing';
import { ConvocatoriaController } from './convocatoria.controller';
import { ConvocatoriaService } from './convocatoria.service';

describe('ConvocatoriaController', () => {
  let controller: ConvocatoriaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConvocatoriaController],
      providers: [ConvocatoriaService],
    }).compile();

    controller = module.get<ConvocatoriaController>(ConvocatoriaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
