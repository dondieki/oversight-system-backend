import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAirlineDto } from './dto/create-airline.dto';
import { UpdateAirlineDto } from './dto/update-airline.dto';
import { Airline } from './entities/airline.entity';
import { AirlineDocument } from './schemas/airline.schema';

@Injectable()
export class AirlineService {
  private readonly logger = new Logger(AirlineService.name);

  constructor(
    @InjectModel(Airline.name)
    private readonly airlineModel: Model<AirlineDocument>,
  ) {}

  async create(createAirlineDto: CreateAirlineDto) {
    try {
      const airline = new this.airlineModel(createAirlineDto);
      await airline.save();

      return {
        Status: 200,
        Message: 'Success',
        Payload: airline,
      };
    } catch (error) {
      this.logger.error('Error adding airline:', error);
      if (error.name === 'ValidationError') {
        throw new HttpException(
          {
            Status: 400,
            Message: 'Validation Error',
            Details: error.message,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (error.code === 11000) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }

      throw new HttpException(
        {
          Status: error.status || 500,
          Message: error.message || 'Internal Server Error',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(query: any) {
    try {
      const { page = 1, limit = 10, search, ...filters } = query;
      const mongooseFilters = this.createFilters(filters);

      if (search) {
        const searchRegex = { $regex: search, $options: 'i' };
        mongooseFilters['$or'] = [
          { name: searchRegex },
          { code: searchRegex },
          { hub: searchRegex },
        ];
      }

      const airlines = await this.airlineModel
        .find(mongooseFilters)
        .sort({ _timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      const total = await this.airlineModel
        .countDocuments(mongooseFilters)
        .exec();

      return {
        Status: 200,
        Message: 'Success',
        Payload: {
          results: airlines,
          total,
          page,
          limit,
        },
      };
    } catch (error) {
      this.logger.error('Error fetching airlines:', error);
      throw new HttpException(
        {
          Status: error.status || 500,
          Message: error.message || 'Internal Server Error',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private createFilters(filters: any): any {
    const mongooseFilters: any = {};
    const stringFilters = ['name', 'code', 'hub'].sort();
    stringFilters.forEach((field) => {
      if (filters[field]) {
        mongooseFilters[field] = { $regex: filters[field], $options: 'i' };
      }
    });

    return mongooseFilters;
  }

  async findOne(id: string) {
    try {
      const airline = await this.airlineModel.findOne({ _id: id }).exec();
      if (!airline) {
        throw new HttpException('Airline not found', HttpStatus.NOT_FOUND);
      }

      return {
        Status: 200,
        Message: 'Success',
        Payload: airline,
      };
    } catch (error) {
      this.logger.error('Error fetching airline:', error);
      throw new HttpException(
        {
          Status: error.status || 500,
          Message: error.message || 'Internal Server Error',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateAirlineDto: UpdateAirlineDto) {
    try {
      const airline = await this.airlineModel
        .findOneAndUpdate({ _id: id }, updateAirlineDto, { new: true })
        .exec();

      if (!airline) {
        throw new HttpException('Airline not found', HttpStatus.NOT_FOUND);
      }

      return {
        Status: 200,
        Message: 'Success',
        Payload: airline,
      };
    } catch (error) {
      this.logger.error('Error updating airline:', error);
      throw new HttpException(
        {
          Status: error.status || 500,
          Message: error.message || 'Internal Server Error',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      const airline = await this.airlineModel
        .findOneAndDelete({ _id: id })
        .exec();

      if (!airline) {
        throw new HttpException('Airline not found', HttpStatus.NOT_FOUND);
      }

      return {
        Status: 200,
        Message: 'Success',
        Payload: { id },
      };
    } catch (error) {
      this.logger.error('Error deleting airline:', error);
      throw new HttpException(
        {
          Status: error.status || 500,
          Message: error.message || 'Internal Server Error',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
