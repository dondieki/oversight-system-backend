import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateMaintenanceOrganizationDto {
  @IsString()
  @IsOptional()
  name: string; // Name of the maintenance organization

  @IsString()
  @IsOptional()
  location: string; // Location of the maintenance organization

  @IsArray()
  @IsOptional()
  aircraftTypes: string[]; // Types of aircraft maintained
}
