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
import { CreateRunwayDto } from './dto/create-runway.dto';
import { UpdateRunwayDto } from './dto/update-runway.dto';
import { RunwaysService } from './runways.service';

@Controller('runways')
export class RunwaysController {
  constructor(private readonly runwaysService: RunwaysService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createRunwayDto: CreateRunwayDto) {
    return this.runwaysService.create(createRunwayDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: any) {
    return this.runwaysService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.runwaysService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateRunwayDto: UpdateRunwayDto) {
    return this.runwaysService.update(id, updateRunwayDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.runwaysService.remove(id);
  }
}
