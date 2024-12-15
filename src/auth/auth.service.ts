import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Password, PasswordDocument } from '../users/schemas/password.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { AuthDto } from './dto/auth.dto';
import { InviteDto } from './dto/invite.dto';
import { PasswordResetDto } from './dto/password-reset.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Password.name) private passwordModel: Model<PasswordDocument>,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async sendInvite(inviteDto: InviteDto) {
    try {
      const { email, firstName } = inviteDto;

      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) {
        throw new HttpException('Email already in use', HttpStatus.CONFLICT);
      }

      // Create and save the user
      const user = new this.userModel(inviteDto);
      await user.save();

      // Generate a secure password
      const generatedPassword = crypto.randomBytes(8).toString('hex'); // Generates a random password

      // Hash the generated password
      const hashedPassword = await this.hashPassword(generatedPassword);

      // Create the password entry
      const userId = user.id as string;

      const passwordEntry = new this.passwordModel({
        userId: user._id,
        hashedPassword,
      });
      await passwordEntry.save(); // Save the password entry

      // Generate and save the reset token
      const resetToken = await this.generateAndSaveResetToken(userId, email);

      // Construct the URL for the password reset
      const url = `${process.env.ADMIN_BASE_URL}/auth/change-password?token=${resetToken}&email=${email}`;

      // Send the email with the reset password link
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome to Flight Guardian',
        template: './invite',
        context: {
          firstName: firstName,
          generatedPassword: generatedPassword,
          url: url,
        },
      });

      return {
        Status: HttpStatus.CREATED,
        Message: 'User invited successfully. Email sent.',
        Payload: { email: user.email },
      };
    } catch (error) {
      this.logger.error('Error sending invite:', error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async generateAndSaveResetToken(
    userId: string,
    email: string,
  ): Promise<string> {
    const resetToken = uuidv4();
    const hashedToken = await this.hashPassword(resetToken);

    // Save the token and set used to false
    await this.passwordModel.updateOne(
      { userId },
      {
        resetToken: hashedToken,
        used: false,
        tokenExpiry: Date.now() + 3600000,
      },
    );

    return resetToken;
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async login(authDto: AuthDto) {
    const { email, password } = authDto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      this.logger.warn(`User not found: ${email}`);
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const passwordEntry = await this.passwordModel.findOne({
      userId: user._id,
    });

    if (
      !passwordEntry ||
      !(await bcrypt.compare(password, passwordEntry.hashedPassword))
    ) {
      this.logger.warn(`Invalid credentials for user: ${email}`);
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const token = this.jwtService.sign({
      email: user.email,
      sub: user._id,
      role: user.role,
    });

    return {
      Status: HttpStatus.OK,
      Message: 'Login successful',
      Payload: { user: { ...user.toObject(), token } },
    };
  }

  async requestPasswordReset(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Generate reset token and hash it
    const userId = user._id as string;
    const resetToken = await this.generateAndSaveResetToken(userId, email);

    // Construct the URL for the password reset
    const url = `${process.env.ADMIN_BASE_URL}/auth/change-password?token=${resetToken}&email=${email}`;

    // Send the email with the reset password link
    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset Request',
      template: './password-reset',
      context: {
        firstName: user.firstName.toUpperCase(),
        url: url,
      },
    });

    return {
      Status: HttpStatus.OK,
      Message: 'Password reset email sent.',
      Payload: { email },
    };
  }

  async resetPassword(passwordResetDto: PasswordResetDto) {
    const { email, newPassword, token } = passwordResetDto;

    // Validate user existence
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Verify the token and check if it matches the stored token for the user
    const passwordEntry = await this.passwordModel.findOne({
      userId: user._id,
    });
    console.log({ passwordEntry });

    // Check if passwordEntry exists
    if (!passwordEntry) {
      throw new HttpException('Password entry not found', HttpStatus.NOT_FOUND);
    }

    // Compare the hashed token
    const tokenIsValid = await bcrypt.compare(token, passwordEntry.resetToken);

    console.log({ tokenIsValid });
    console.log({ token });

    // Validate token
    if (!tokenIsValid) {
      throw new HttpException(
        'Invalid or expired reset token',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check if the token has been used
    if (passwordEntry.used) {
      throw new HttpException(
        'Invalid or expired reset token',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check for token expiry (if implemented)
    if (Date.now() > passwordEntry.tokenExpiry) {
      throw new HttpException(
        'Invalid or expired reset token',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Update password
    const hashedPassword = await this.hashPassword(newPassword);
    await this.passwordModel.updateOne(
      { userId: user._id },
      { hashedPassword, used: true }, // Set used to true
    );

    return {
      Status: HttpStatus.OK,
      Message: 'Password reset successfully',
      Payload: { email: user.email },
    };
  }
}
