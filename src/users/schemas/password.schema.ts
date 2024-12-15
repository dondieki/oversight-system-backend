import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PasswordDocument = Password & Document;

@Schema()
export class Password {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  hashedPassword: string;

  @Prop({ required: false })
  resetToken: string;

  @Prop({ required: false })
  tokenExpiry: number;

  @Prop({ type: Boolean, default: false, required: false })
  used: boolean;

  @Prop({ type: Number, default: Date.now })
  _timestamp?: number;

  @Prop({ type: Number })
  _utimestamp?: number;
}

export const PasswordSchema = SchemaFactory.createForClass(Password);

PasswordSchema.pre('save', function (next) {
  if (!this._timestamp) {
    this._timestamp = Date.now();
  }
  this._utimestamp = Date.now();
  next();
});
