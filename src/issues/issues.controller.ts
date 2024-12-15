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
import { DownloadReportDto } from 'src/inspections/dto/download-report.dto';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { IssuesService } from './issues.service';

@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createIssueDto: CreateIssueDto) {
    return this.issuesService.create(createIssueDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: any) {
    return this.issuesService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.issuesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateIssueDto: UpdateIssueDto) {
    return this.issuesService.update(id, updateIssueDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.issuesService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('download-report')
  report(@Body() downloadReportDto: DownloadReportDto) {
    return this.issuesService.generateAndSendExcelReport(downloadReportDto);
  }
}
