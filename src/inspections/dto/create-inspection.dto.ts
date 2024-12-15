import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateInspectionDto {
  @IsOptional()
  airportId: Types.ObjectId | null;

  @IsOptional()
  airlineId: Types.ObjectId | null;

  @IsOptional()
  ansStationId: Types.ObjectId | null;

  @IsOptional()
  maintenanceOrgId: Types.ObjectId | null;

  @IsNotEmpty()
  inspectorId: Types.ObjectId;

  @IsBoolean()
  isComplete: boolean;

  @IsNumber()
  _deadline: number;
}
