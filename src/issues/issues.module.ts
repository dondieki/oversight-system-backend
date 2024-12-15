import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Airport } from 'src/airports/entities/airport.entity';
import { AirportSchema } from 'src/airports/schemas/airport.schema';
import { Runway, RunwaySchema } from 'src/runways/schemas/runway.schema';
import { Taxiway, TaxiwaySchema } from 'src/taxiways/schemas/taxiway.schema';
import { IssuesController } from './issues.controller';
import { IssuesService } from './issues.service';
import { Issue, IssueSchema } from './schemas/issues.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Issue.name, schema: IssueSchema },
      { name: Airport.name, schema: AirportSchema },
      { name: Runway.name, schema: RunwaySchema },
      { name: Taxiway.name, schema: TaxiwaySchema },
    ]),
  ],
  controllers: [IssuesController],
  providers: [IssuesService],
})
export class IssuesModule {}
