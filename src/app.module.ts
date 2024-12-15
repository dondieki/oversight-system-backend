import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { AirportsModule } from './airports/airports.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { EmailService } from './email/email.service';
import { InspectionsModule } from './inspections/inspections.module';
import { RunwaysModule } from './runways/runways.module';
import { UsersModule } from './users/users.module';
import { TaxiwaysModule } from './taxiways/taxiways.module';
import { IssuesModule } from './issues/issues.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AirlineModule } from './airline/airline.module';
import { AnsStationsModule } from './ans-stations/ans-stations.module';
import { MaintenanceOrganizationsModule } from './maintenance-organizations/maintenance-organizations.module';

console.log(join(__dirname, '..', 'src', 'templates', 'mail'));

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DATABASE_URI),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"No Reply" <${process.env.EMAIL_USER}>`,
      },
      template: {
        dir: join(__dirname, '..', 'src', 'templates', 'mail'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    UsersModule,
    AuthModule,
    CloudinaryModule,
    InspectionsModule,
    RunwaysModule,
    AirportsModule,
    TaxiwaysModule,
    IssuesModule,
    DashboardModule,
    AirlineModule,
    AnsStationsModule,
    MaintenanceOrganizationsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
    EmailService,
  ],
})
export class AppModule {}
