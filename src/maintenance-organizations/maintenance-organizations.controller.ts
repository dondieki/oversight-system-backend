import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard/jwt-auth-guard.guard';
import { CreateMaintenanceOrganizationDto } from './dto/create-maintenance-organization.dto';
import { UpdateMaintenanceOrganizationDto } from './dto/update-maintenance-organization.dto';
import { MaintenanceOrganizationsService } from './maintenance-organizations.service';

@Controller('maintenance-organizations')
export class MaintenanceOrganizationsController {
  constructor(
    private readonly maintenanceOrganizationsService: MaintenanceOrganizationsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createMaintenanceOrganizationDto: CreateMaintenanceOrganizationDto,
  ) {
    return this.maintenanceOrganizationsService.create(
      createMaintenanceOrganizationDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: any) {
    return this.maintenanceOrganizationsService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.maintenanceOrganizationsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateMaintenanceOrganizationDto: UpdateMaintenanceOrganizationDto,
  ) {
    return this.maintenanceOrganizationsService.update(
      id,
      updateMaintenanceOrganizationDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.maintenanceOrganizationsService.remove(id);
  }
}
