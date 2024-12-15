import { Test, TestingModule } from '@nestjs/testing';
import { RunwaysController } from './runways.controller';
import { RunwaysService } from './runways.service';

describe('RunwaysController', () => {
  let controller: RunwaysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RunwaysController],
      providers: [RunwaysService],
    }).compile();

    controller = module.get<RunwaysController>(RunwaysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
