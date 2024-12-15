import { IsEmail, IsNotEmpty } from 'class-validator';

export class PasswordResetDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  newPassword: string;

  @IsNotEmpty()
  token: string; 
}
