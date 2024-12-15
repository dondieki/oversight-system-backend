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
import { CreateAirlineDto } from './dto/create-airline.dto';
import { UpdateAirlineDto } from './dto/update-airline.dto';
import { AirlineService } from './airline.service';

@Controller('airlines')
export class AirlineController {
  constructor(private readonly airlineService: AirlineService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createAirlineDto: CreateAirlineDto) {
    return this.airlineService.create(createAirlineDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: any) {
    return this.airlineService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.airlineService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateAirlineDto: UpdateAirlineDto) {
    return this.airlineService.update(id, updateAirlineDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.airlineService.remove(id);
  }
}
