import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateANSStationDto {
  @IsString()
  @IsOptional()
  name: string; // Name of the ANS station

  @IsArray()
  @IsOptional()
  services: string[]; // List of services provided by the ANS station
}
