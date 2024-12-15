import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly mailerService: MailerService) {}

  /**
   * Sends an email with the specified details.
   * @param email - Recipient email address(es).
   * @param subject - Email subject.
   * @param template - Path to the email template (optional).
   * @param context - Context for the template rendering (optional).
   */
  async sendEmail(
    email: string | string[], // Allow single or multiple recipients
    subject: string,
    template: string = '', // Default to an empty string
    context: Record<string, any> = {}, // Default to an empty object
  ): Promise<void> {
    try {
      this.logger.debug(`Preparing to send email to ${email}`);
      await this.mailerService.sendMail({
        to: email,
        subject: subject,
        template,
        context,
      });
      this.logger.log(
        `Email sent successfully to ${Array.isArray(email) ? email.join(', ') : email}`,
      );
    } catch (error) {
      this.logger.error(`Failed to send email to ${email}`, error.stack);
      throw new Error('Failed to send email. Please try again later.');
    }
  }
}
