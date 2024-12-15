import { Test, TestingModule } from '@nestjs/testing';
import { AnsStationsService } from './ans-stations.service';

describe('AnsStationsService', () => {
  let service: AnsStationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnsStationsService],
    }).compile();

    service = module.get<AnsStationsService>(AnsStationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
