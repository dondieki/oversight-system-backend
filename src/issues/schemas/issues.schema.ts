import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { Document, Types } from 'mongoose';

export type IssueDocument = Issue & Document;

@Schema({ timestamps: true })
export class Issue extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'Airport',
    required: false,
    unique: false,
  })
  airportId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Runway', required: false, unique: false })
  runwayId: Types.ObjectId | null;

  @Prop({
    type: Types.ObjectId,
    ref: 'Taxiway',
    required: false,
    unique: false,
  })
  taxiwayId: Types.ObjectId | null;

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

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  inspectionType: string;

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  entity: string;

  @Prop({ type: String, required: true })
  @IsNotEmpty()
  comment: string;

  @Prop({ default: false })
  @IsNotEmpty()
  @IsBoolean()
  isResolved: boolean;

  @Prop({ type: Number, default: Date.now })
  _timestamp: number;

  @Prop({ type: Number })
  _utimestamp: number;
}

export const IssueSchema = SchemaFactory.createForClass(Issue);

// Middleware to update the _utimestamp field on save
IssueSchema.pre('save', function (next) {
  if (!this._timestamp) {
    this._timestamp = Date.now();
  }
  this._utimestamp = Date.now();
  next();
});
