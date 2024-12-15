import { Module } from '@nestjs/common';
import { AirlineController } from './airline.controller';
import { AirlineService } from './airline.service';
import { Airline, AirlineSchema } from './schemas/airline.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Airline.name, schema: AirlineSchema }]),
  ],
  controllers: [AirlineController],
  providers: [AirlineService],
})
export class AirlineModule {}
