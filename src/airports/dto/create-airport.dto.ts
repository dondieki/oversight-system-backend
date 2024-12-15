import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateAirportDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @IsString()
  @IsNotEmpty()
  postalAddress: string;

  @IsString()
  @IsNotEmpty()
  physicalAddress: string;
}
