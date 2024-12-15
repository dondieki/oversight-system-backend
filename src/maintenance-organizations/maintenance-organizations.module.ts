import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MaintenanceOrganizationsController } from './maintenance-organizations.controller';
import { MaintenanceOrganizationsService } from './maintenance-organizations.service';
import {
  MaintenanceOrganization,
  MaintenanceOrganizationSchema,
} from './schemas/maintenance-origanisation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MaintenanceOrganization.name,
        schema: MaintenanceOrganizationSchema,
      },
    ]),
  ],
  controllers: [MaintenanceOrganizationsController],
  providers: [MaintenanceOrganizationsService],
})
export class MaintenanceOrganizationsModule {}
