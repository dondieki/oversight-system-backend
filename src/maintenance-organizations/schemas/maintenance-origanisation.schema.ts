import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Document } from 'mongoose';

export type MaintenanceOrganizationDocument = MaintenanceOrganization &
  Document;

@Schema({ timestamps: true })
export class MaintenanceOrganization extends Document {
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  location: string;

  @Prop({ type: [String], required: true })
  @IsArray()
  @IsNotEmpty()
  aircraftTypes: string[];

  @Prop({ type: Number, default: Date.now })
  _timestamp: number;

  @Prop({ type: Number })
  _utimestamp: number;
}

export const MaintenanceOrganizationSchema = SchemaFactory.createForClass(
  MaintenanceOrganization,
);

// Middleware to automatically update the _timestamp field
MaintenanceOrganizationSchema.pre('save', function (next) {
  if (!this._timestamp) {
    this._timestamp = Date.now();
  }
  this._utimestamp = Date.now();
  next();
});
