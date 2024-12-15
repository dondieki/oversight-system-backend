import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { Document } from 'mongoose';

export type ANSStationDocument = ANSStation & Document;

@Schema({ timestamps: true })
export class ANSStation extends Document {
  @Prop({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Prop({ type: [String], required: true })
  @IsArray()
  @IsNotEmpty()
  services: string[];

  @Prop({ type: Number, default: Date.now })
  _timestamp: number;

  @Prop({ type: Number })
  _utimestamp: number;
}

export const ANSStationSchema = SchemaFactory.createForClass(ANSStation);

ANSStationSchema.pre('save', function (next) {
  if (!this._timestamp) {
    this._timestamp = Date.now();
  }
  this._utimestamp = Date.now();
  next();
});
