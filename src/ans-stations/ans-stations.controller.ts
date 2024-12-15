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
import { AnsStationsService } from './ans-stations.service';
import { CreateANSStationDto } from './dto/create-ans-station.dto';
import { UpdateANSStationDto } from './dto/update-ans-station.dto';

@Controller('ans-stations')
export class AnsStationsController {
  constructor(private readonly ansStationsService: AnsStationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createAnsStationDto: CreateANSStationDto) {
    return this.ansStationsService.create(createAnsStationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: any) {
    return this.ansStationsService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ansStationsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAnsStationDto: UpdateANSStationDto,
  ) {
    return this.ansStationsService.update(id, updateAnsStationDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ansStationsService.remove(id);
  }
}
