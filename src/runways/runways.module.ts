import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Runway } from './entities/runway.entity';
import { RunwaysController } from './runways.controller';
import { RunwaysService } from './runways.service';
import { RunwaySchema } from './schemas/runway.schema';
import { AirportsModule } from 'src/airports/airports.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Runway.name, schema: RunwaySchema }]),    
  ],
  controllers: [RunwaysController],
  providers: [RunwaysService],
})
export class RunwaysModule {}
