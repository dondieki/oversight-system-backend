import { Test, TestingModule } from '@nestjs/testing';
import { TaxiwaysController } from './taxiways.controller';
import { TaxiwaysService } from './taxiways.service';

describe('TaxiwaysController', () => {
  let controller: TaxiwaysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaxiwaysController],
      providers: [TaxiwaysService],
    }).compile();

    controller = module.get<TaxiwaysController>(TaxiwaysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
