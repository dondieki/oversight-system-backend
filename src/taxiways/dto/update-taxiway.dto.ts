import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTaxiwayDto {
  @IsOptional()
  @IsString()
  airportId: string;

  @IsOptional()
  @IsString()
  number: string;

  @IsOptional()
  @IsNumber()
  width: number;

  @IsOptional()
  @IsNumber()
  length: number;

  @IsOptional()
  @IsString()
  surfaceType: string;

  @IsOptional()
  @IsBoolean()
  inService: boolean;
}
