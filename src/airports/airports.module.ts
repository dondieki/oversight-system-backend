import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AirportsController } from './airports.controller';
import { AirportsService } from './airports.service';
import { Airport, AirportSchema } from './schemas/airport.schema';
import { Runway, RunwaySchema } from 'src/runways/schemas/runway.schema';
import { Taxiway, TaxiwaySchema } from 'src/taxiways/schemas/taxiway.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Airport.name, schema: AirportSchema },
      { name: Runway.name, schema: RunwaySchema },
      { name: Taxiway.name, schema: TaxiwaySchema },
    ]),
  ],
  controllers: [AirportsController],
  providers: [AirportsService],
})
export class AirportsModule {}
