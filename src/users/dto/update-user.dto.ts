import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { UserRole } from 'src/enums/user.roles.enums';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  idNumber: string;

  @IsString()
  @IsOptional()
  role: UserRole;
}
