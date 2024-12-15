import { IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateIssueDto {
  @IsOptional()
  airportId: Types.ObjectId | null;

  @IsOptional()
  airlineId: Types.ObjectId | null;

  @IsOptional()
  ansStationId: Types.ObjectId | null;

  @IsOptional()
  maintenanceOrgId: Types.ObjectId | null;

  @IsOptional()
  runwayId: Types.ObjectId | null;

  @IsOptional()
  taxiwayId: Types.ObjectId | null;

  @IsNotEmpty()
  inspectionType: string;

  @IsNotEmpty()
  entity: string;

  @IsNotEmpty()
  comment: string;
}
