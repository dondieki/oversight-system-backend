import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard/jwt-auth-guard.guard';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { InviteDto } from './dto/invite.dto';
import { PasswordResetDto } from './dto/password-reset.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Post('send-invite')
  async sendInvite(@Body() inviteDto: InviteDto) {
    return this.authService.sendInvite(inviteDto);
  }

  @Post('login')
  // Login
  async login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }

  @Post('request-reset')
  async requestPasswordReset(@Body() { email }: { email: string }) {
    return this.authService.requestPasswordReset(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() passwordResetDto: PasswordResetDto) {
    return this.authService.resetPassword(passwordResetDto);
  }
}
