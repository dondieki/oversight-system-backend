import { Test, TestingModule } from '@nestjs/testing';
import { RunwaysService } from './runways.service';

describe('RunwaysService', () => {
  let service: RunwaysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RunwaysService],
    }).compile();

    service = module.get<RunwaysService>(RunwaysService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
