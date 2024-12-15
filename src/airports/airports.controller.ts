import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AirportsService } from './airports.service';
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard/jwt-auth-guard.guard';

@Controller('airports')
export class AirportsController {
  constructor(private readonly airportsService: AirportsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createAirportDto: CreateAirportDto) {
    return this.airportsService.create(createAirportDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: any) {
    return this.airportsService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.airportsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('runways/:id')
  findRunways(@Param('id') id: string, @Query() query: any) {
    return this.airportsService.findRunways(id, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('taxiways/:id')
  findTaxiways(@Param('id') id: string, @Query() query: any) {
    return this.airportsService.findTaxiways(id, query);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateAirportDto: UpdateAirportDto) {
    return this.airportsService.update(id, updateAirportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.airportsService.remove(id);
  }
}
