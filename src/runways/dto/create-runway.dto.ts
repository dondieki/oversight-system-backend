import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRunwayDto {
  @IsNotEmpty()
  @IsString()
  airportId: string;

  @IsNotEmpty()
  @IsString()
  number: string;

  @IsNotEmpty()
  @IsNumber()
  width: number;

  @IsNotEmpty()
  @IsNumber()
  length: number;

  @IsNotEmpty()
  @IsString()
  surfaceType: string;

  @IsNotEmpty()
  @IsBoolean()
  inService: boolean;
}
