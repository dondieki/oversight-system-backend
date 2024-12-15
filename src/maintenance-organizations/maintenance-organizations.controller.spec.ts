import { Test, TestingModule } from '@nestjs/testing';
import { MaintenanceOrganizationsController } from './maintenance-organizations.controller';
import { MaintenanceOrganizationsService } from './maintenance-organizations.service';

describe('MaintenanceOrganizationsController', () => {
  let controller: MaintenanceOrganizationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaintenanceOrganizationsController],
      providers: [MaintenanceOrganizationsService],
    }).compile();

    controller = module.get<MaintenanceOrganizationsController>(
      MaintenanceOrganizationsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
