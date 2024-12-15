import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth-guard/jwt-auth-guard.guard';
import { CreateTaxiwayDto } from './dto/create-taxiway.dto';
import { UpdateTaxiwayDto } from './dto/update-taxiway.dto';
import { TaxiwaysService } from './taxiways.service';

@Controller('taxiways')
export class TaxiwaysController {
  constructor(private readonly taxiwaysService: TaxiwaysService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createRunwayDto: CreateTaxiwayDto) {
    return this.taxiwaysService.create(createRunwayDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: any) {
    return this.taxiwaysService.findAll(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taxiwaysService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateRunwayDto: UpdateTaxiwayDto) {
    return this.taxiwaysService.update(id, updateRunwayDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taxiwaysService.remove(id);
  }
}
