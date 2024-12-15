import { IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateIssueDto {
  @IsOptional()
  airportId: string;

  @IsOptional()
  airlineId: string;

  @IsOptional()
  ansStationId: string;

  @IsOptional()
  maintenanceOrgId: string;

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
