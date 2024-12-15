import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateRunwayDto } from 'src/runways/dto/update-runway.dto';
import { CreateRunwayDto } from './dto/create-runway.dto';
import { Runway } from './entities/runway.entity';
import { RunwayDocument } from './schemas/runway.schema';

@Injectable()
export class RunwaysService {
  private readonly logger = new Logger(RunwaysService.name);

  constructor(
    @InjectModel(Runway.name)
    private readonly runwayModel: Model<RunwayDocument>,
  ) {}

  async create(createrunwayDto: CreateRunwayDto) {
    try {
      const runway = new this.runwayModel(createrunwayDto);
      await runway.save();

      return {
        Status: 200,
        Message: 'Success',
        Payload: runway,
      };
    } catch (error) {
      this.logger.error('Error adding airport:', error);
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
        const searchFilters = {
          $or: [
            { number: searchRegex },
            { surfaceType: searchRegex },
            { length: searchRegex },
            { idNumber: searchRegex },
            { width: searchRegex },
          ],
        };
        mongooseFilters['$or'] = [
          ...(mongooseFilters['$or'] || []),
          ...searchFilters['$or'],
        ];
      }

      const runways = await this.runwayModel
        .find(mongooseFilters)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      const total = await this.runwayModel
        .countDocuments(mongooseFilters)
        .exec();

      return {
        Status: 200,
        Message: 'Success',
        Payload: {
          results: runways,
          total,
          page,
          limit,
        },
      };
    } catch (error) {
      return {
        Status: error.status || 500,
        Message: error.message || 'An error occurred while fetching runways',
        Payload: null,
      };
    }
  }

  private createFilters(filters: any): any {
    const mongooseFilters: any = {};

    const stringFilters = ['number', 'width', 'surfaceType', 'length'].sort();
    stringFilters.forEach((field) => {
      if (filters[field]) {
        mongooseFilters[field] = { $regex: filters[field], $options: 'i' };
      }
    });

    console.log(mongooseFilters);
    return mongooseFilters;
  }

  async findOne(id: string) {
    try {
      const runway = await this.runwayModel.findOne({ _id: id }).exec();
      if (!runway) {
        throw new HttpException('runway not found', HttpStatus.NOT_FOUND);
      }

      return {
        Status: 200,
        Message: 'Success',
        Payload: runway,
      };
    } catch (error) {
      console.error('Failed to update runway:', error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.http_code || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updaterunwayDto: UpdateRunwayDto) {
    try {
      const runway = await this.runwayModel
        .findOneAndUpdate({ _id: id }, updaterunwayDto, { new: true })
        .exec();

      if (!runway) {
        throw new HttpException('runway not found', HttpStatus.NOT_FOUND);
      }

      return {
        Status: 200,
        Message: 'Success',
        Payload: runway,
      };
    } catch (error) {
      console.error('Failed to update runway:', error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.http_code || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      const runway = await this.runwayModel
        .findOneAndDelete({ _id: id })
        .exec();

      if (!runway) {
        throw new HttpException('runway not found', HttpStatus.NOT_FOUND);
      }

      return {
        Status: 200,
        Message: 'Success',
        Payload: { id },
      };
    } catch (error) {
      console.error('Failed to delete runway:', error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.http_code || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
