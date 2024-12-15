import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { Document } from 'mongoose';

export type AirportDocument = Airport & Document;

@Schema({ timestamps: true })
export class Airport extends Document {
  @Prop({ required: true, trim: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Prop({ required: true, unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Prop({ required: true, trim: true, unique: true })
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @Prop({ required: true, trim: true })
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @Prop({ required: true, trim: true })
  @IsString()
  @IsNotEmpty()
  postalAddress: string;

  @Prop({ required: true, trim: true })
  @IsString()
  @IsNotEmpty()
  physicalAddress: string;

  @Prop({ type: Number, default: Date.now })
  _timestamp: number;

  @Prop({ type: Number })
  _utimestamp: number;
}

export const AirportSchema = SchemaFactory.createForClass(Airport);

// Middleware to automatically update the _timestamp field
AirportSchema.pre('save', function (next) {
  if (!this._timestamp) {
    this._timestamp = Date.now();
  }
  this._utimestamp = Date.now();
  next();
});
