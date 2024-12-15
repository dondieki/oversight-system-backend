import { Test, TestingModule } from '@nestjs/testing';
import { AirportsController } from './airports.controller';
import { AirportsService } from './airports.service';

describe('AirportsController', () => {
  let controller: AirportsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirportsController],
      providers: [AirportsService],
    }).compile();

    controller = module.get<AirportsController>(AirportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
