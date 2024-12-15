import { Test, TestingModule } from '@nestjs/testing';
import { TaxiwaysService } from './taxiways.service';

describe('TaxiwaysService', () => {
  let service: TaxiwaysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaxiwaysService],
    }).compile();

    service = module.get<TaxiwaysService>(TaxiwaysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
