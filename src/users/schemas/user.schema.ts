import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { Document } from 'mongoose';
import { UserRole } from '../../enums/user.roles.enums';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Prop()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Prop()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Prop()
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @Prop()
  @IsString()
  @IsNotEmpty()
  idNumber: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true, enum: UserRole, default: UserRole.Inspector })
  @IsString()
  @IsNotEmpty()
  role: UserRole;

  @Prop({ type: Number, default: Date.now })
  _timestamp: number;

  @Prop({ type: Number })
  _utimestamp: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  if (!this._timestamp) {
    this._timestamp = Date.now();
  }
  this._utimestamp = Date.now();
  next();
});
