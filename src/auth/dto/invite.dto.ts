import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { UserRole } from 'src/enums/user.roles.enums';

export class InviteDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  idNumber: string;

  @IsString()
  @IsNotEmpty()
  role: UserRole;
}
