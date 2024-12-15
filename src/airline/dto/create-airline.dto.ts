import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAirlineDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Name of the airline

  @IsNumber()
  @IsNotEmpty()
  numberOfAircraft: number; // Total number of aircraft

  @IsArray()
  @IsNotEmpty()
  routesFlown: string[]; // Routes or airports flown by the airline

  @IsNumber()
  @IsNotEmpty()
  totalPassengers: number; // Total passengers carried
}
