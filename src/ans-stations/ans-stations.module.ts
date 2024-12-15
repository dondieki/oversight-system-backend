import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnsStationsController } from './ans-stations.controller';
import { AnsStationsService } from './ans-stations.service';
import { ANSStation, ANSStationSchema } from './schemas/airline.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ANSStation.name, schema: ANSStationSchema },
    ]),
  ],
  controllers: [AnsStationsController],
  providers: [AnsStationsService],
})
export class AnsStationsModule {}
