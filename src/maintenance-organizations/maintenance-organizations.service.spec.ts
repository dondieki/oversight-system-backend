import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceOrganizationsService } from './maintenance-organizations.service';

describe('MaintenanceOrganizationsService', () => {
  let service: MaintenanceOrganizationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MaintenanceOrganizationsService],
    }).compile();

    service = module.get<MaintenanceOrganizationsService>(MaintenanceOrganizationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
