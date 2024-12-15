import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Document, Types } from 'mongoose';

export type TaxiwayDocument = Taxiway & Document;

@Schema({ timestamps: true })
export class Taxiway extends Document {
  @Prop({ required: true })
  airportId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  @IsNotEmpty()
  @IsString()
  number: string;

  @Prop()
  @IsNotEmpty()
  @IsNumber()
  width: number;

  @Prop()
  @IsNotEmpty()
  @IsNumber()
  length: number;

  @Prop()
  @IsNotEmpty()
  surfaceType: string;

  @Prop()
  @IsNotEmpty()
  @IsBoolean()
  inService: boolean;

  @Prop({ type: Number, default: Date.now })
  _timestamp: number;

  @Prop({ type: Number })
  _utimestamp: number;
}

export const TaxiwaySchema = SchemaFactory.createForClass(Taxiway);

// Middleware to automatically update the _timestamp field
TaxiwaySchema.pre('save', function (next) {
  if (!this._timestamp) {
    this._timestamp = Date.now();
  }
  this._utimestamp = Date.now();
  next();
});
