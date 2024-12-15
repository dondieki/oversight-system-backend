import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { Document, Types } from 'mongoose';

export type InspectionDocument = Inspection & Document;

@Schema({ timestamps: true })
export class Inspection extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'Airport',
    required: false,
    unique: false,
  })
  @IsNotEmpty()
  airportId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Airline',
    required: false,
    unique: false,
  })
  @IsNotEmpty()
  airlineId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'ANSStation',
    required: false,
    unique: false,
  })
  @IsNotEmpty()
  ansStationId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'MaintenanceOrganization',
    required: false,
    unique: false,
  })
  @IsNotEmpty()
  maintenanceOrgId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: false })
  @IsNotEmpty()
  inspectorId: Types.ObjectId;

  @Prop({ required: true })
  @IsBoolean()
  isComplete: boolean;

  @Prop({ type: Number })
  @IsNotEmpty()
  _deadline: number;

  @Prop({ type: Number, default: Date.now })
  _timestamp: number;

  @Prop({ type: Number })
  _utimestamp: number;
}

export const InspectionSchema = SchemaFactory.createForClass(Inspection);

// Middleware to update the _utimestamp field on save
InspectionSchema.pre('save', function (next) {
  if (!this._timestamp) {
    this._timestamp = Date.now();
  }
  this._utimestamp = Date.now();
  next();
});
