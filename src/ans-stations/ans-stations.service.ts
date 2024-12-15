import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateANSStationDto } from './dto/create-ans-station.dto';
import { UpdateANSStationDto } from './dto/update-ans-station.dto';
import { ANSStation, ANSStationDocument } from './schemas/airline.schema';

@Injectable()
export class AnsStationsService {
  private readonly logger = new Logger(AnsStationsService.name);

  constructor(
    @InjectModel(ANSStation.name)
    private readonly ansStationModel: Model<ANSStationDocument>,
  ) {}

  // Create a new ANS station
  async create(createDto: CreateANSStationDto) {
    try {
      const station = new this.ansStationModel(createDto);
      await station.save();

      return this.successResponse(station);
    } catch (error) {
      this.handleError(error, 'Error adding ANS station');
    }
  }

  // Find all ANS stations with filtering and pagination
  async findAll(query: any) {
    try {
      const { page = 1, limit = 10, search, ...filters } = query;
      const mongooseFilters = this.createFilters(filters, search);

      const [stations, total] = await Promise.all([
        this.ansStationModel
          .find(mongooseFilters)
          .skip((page - 1) * limit)
          .limit(limit)
          .sort({ _timestamp: -1 })
          .exec(),
        this.ansStationModel.countDocuments(mongooseFilters).exec(),
      ]);

      return this.successResponse({ results: stations, total, page, limit });
    } catch (error) {
      this.handleError(error, 'Error fetching ANS stations');
    }
  }

  // Create MongoDB filters from query parameters
  private createFilters(filters: any, search: string) {
    const mongooseFilters: any = {};
    const searchableFields = ['name', 'location', 'identifier'];

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      mongooseFilters['$or'] = searchableFields.map((field) => ({
        [field]: searchRegex,
      }));
    }

    searchableFields.forEach((field) => {
      if (filters[field]) {
        mongooseFilters[field] = { $regex: filters[field], $options: 'i' };
      }
    });

    return mongooseFilters;
  }

  // Find a single ANS station by its ID
  async findOne(id: string) {
    try {
      const station = await this.ansStationModel.findById(id).exec();
      if (!station) {
        throw new HttpException('ANS station not found', HttpStatus.NOT_FOUND);
      }

      return this.successResponse(station);
    } catch (error) {
      this.handleError(error, 'Error fetching ANS station');
    }
  }

  // Update an existing ANS station by its ID
  async update(id: string, updateDto: UpdateANSStationDto) {
    try {
      const station = await this.ansStationModel
        .findByIdAndUpdate(id, updateDto, {
          new: true,
        })
        .exec();

      if (!station) {
        throw new HttpException('ANS station not found', HttpStatus.NOT_FOUND);
      }

      return this.successResponse(station);
    } catch (error) {
      this.handleError(error, 'Error updating ANS station');
    }
  }

  // Delete an ANS station by its ID
  async remove(id: string) {
    try {
      const station = await this.ansStationModel.findByIdAndDelete(id).exec();
      if (!station) {
        throw new HttpException('ANS station not found', HttpStatus.NOT_FOUND);
      }

      return this.successResponse({ id });
    } catch (error) {
      this.handleError(error, 'Error deleting ANS station');
    }
  }

  // Success response helper
  private successResponse(payload: any) {
    return {
      Status: 200,
      Message: 'Success',
      Payload: payload,
    };
  }

  // Error handling helper
  private handleError(error: any, context: string) {
    this.logger.error(`${context}:`, error);

    if (error.name === 'ValidationError') {
      throw new HttpException(
        { Status: 400, Message: 'Validation Error', Details: error.message },
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
