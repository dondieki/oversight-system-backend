import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateANSStationDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Name of the ANS station

  @IsArray()
  @IsNotEmpty()
  services: string[]; // List of services provided by the ANS station
}
