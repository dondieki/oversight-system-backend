import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Document } from 'mongoose';

export type AirlineDocument = Airline & Document;

@Schema({ timestamps: true })
export class Airline extends Document {
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Prop({ required: true })
  @IsNumber()
  @IsNotEmpty()
  numberOfAircraft: number;

  @Prop({ type: [String], required: true })
  @IsArray()
  @IsNotEmpty()
  routesFlown: string[];

  @Prop({ required: true })
  @IsNumber()
  @IsNotEmpty()
  totalPassengers: number;

  @Prop({ type: Number, default: Date.now })
  _timestamp: number;

  @Prop({ type: Number })
  _utimestamp: number;
}

export const AirlineSchema = SchemaFactory.createForClass(Airline);

// Middleware to update the _utimestamp field on save
AirlineSchema.pre('save', function (next) {
  if (!this._timestamp) {
    this._timestamp = Date.now();
  }
  this._utimestamp = Date.now();
  next();
});
