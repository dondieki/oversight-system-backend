import { IsArray, IsOptional, IsNumber, IsString } from 'class-validator';

export class UpdateAirlineDto {
  @IsString()
  @IsOptional()
  name: string; // Name of the airline

  @IsNumber()
  @IsOptional()
  numberOfAircraft: number; // Total number of aircraft

  @IsArray()
  @IsOptional()
  routesFlown: string[]; // Routes or airports flown by the airline

  @IsNumber()
  @IsOptional()
  totalPassengers: number; // Total passengers carried
}
