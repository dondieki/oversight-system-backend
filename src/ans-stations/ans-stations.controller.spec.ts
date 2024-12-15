import { Test, TestingModule } from '@nestjs/testing';
import { AnsStationsController } from './ans-stations.controller';
import { AnsStationsService } from './ans-stations.service';

describe('AnsStationsController', () => {
  let controller: AnsStationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnsStationsController],
      providers: [AnsStationsService],
    }).compile();

    controller = module.get<AnsStationsController>(AnsStationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
