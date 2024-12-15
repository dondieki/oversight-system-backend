import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateMaintenanceOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Name of the maintenance organization

  @IsString()
  @IsNotEmpty()
  location: string; // Location of the maintenance organization

  @IsArray()
  @IsNotEmpty()
  aircraftTypes: string[]; // Types of aircraft maintained
}
