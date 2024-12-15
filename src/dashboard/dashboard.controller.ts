import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard/jwt-auth-guard.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(JwtAuthGuard)
  @Get('summary')
  findUsersCount() {
    return this.dashboardService.getSummary();
  }

  @UseGuards(JwtAuthGuard)
  @Get('users/stats')
  findUsersStats() {
    return this.dashboardService.getUsersStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get('inspections/stats')
  findInspectionsCount() {
    return this.dashboardService.getInspectionsStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get('issues/stats')
  findIssuesStats() {
    return this.dashboardService.getIssuesStats();
  }
}
