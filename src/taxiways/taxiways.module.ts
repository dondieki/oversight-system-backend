import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Taxiway, TaxiwaySchema } from './schemas/taxiway.schema';
import { TaxiwaysController } from './taxiways.controller';
import { TaxiwaysService } from './taxiways.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Taxiway.name, schema: TaxiwaySchema }]),
  ],
  controllers: [TaxiwaysController],
  providers: [TaxiwaysService],
})
export class TaxiwaysModule {}
