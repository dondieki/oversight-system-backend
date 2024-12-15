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
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { InspectionsService } from './inspections.service';
import { DownloadReportDto } from './dto/download-report.dto';

@Controller('inspections')
export class InspectionsController {
  constructor(private readonly inspectionsService: InspectionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createInspectionDto: CreateInspectionDto) {
    return this.inspectionsService.create(createInspectionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('download-report')
  downloadReport(@Body() downloadReportDto: DownloadReportDto) {
    return this.inspectionsService.downloadReport(downloadReportDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: any) {
    return this.inspectionsService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inspectionsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateInspectionDto: UpdateInspectionDto,
  ) {
    return this.inspectionsService.update(id, updateInspectionDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inspectionsService.remove(id);
  }
}
