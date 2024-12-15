import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Inspection } from './entities/inspection.entity';
import { InspectionsController } from './inspections.controller';
import { InspectionsService } from './inspections.service';
import { InspectionSchema } from './schemas/inspection.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inspection.name, schema: InspectionSchema },
    ]),
  ],
  controllers: [InspectionsController],
  providers: [InspectionsService],
})
export class InspectionsModule {}
