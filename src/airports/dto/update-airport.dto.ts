import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateAirportDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  postalCode: string;

  @IsString()
  @IsOptional()
  postalAddress: string;

  @IsString()
  @IsOptional()
  physicalAddress: string;
}
