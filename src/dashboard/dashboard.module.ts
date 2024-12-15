import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Airport, AirportSchema } from 'src/airports/schemas/airport.schema';
import { Inspection } from 'src/inspections/entities/inspection.entity';
import { InspectionSchema } from 'src/inspections/schemas/inspection.schema';
import { Issue, IssueSchema } from 'src/issues/schemas/issues.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Airport.name, schema: AirportSchema },
      { name: Inspection.name, schema: InspectionSchema },
      { name: Issue.name, schema: IssueSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
