import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaxiwayDto } from './dto/create-taxiway.dto';
import { UpdateTaxiwayDto } from './dto/update-taxiway.dto';
import { Taxiway } from './entities/taxiway.entity';
import { TaxiwayDocument } from './schemas/taxiway.schema';

@Injectable()
export class TaxiwaysService {
  private readonly logger = new Logger(TaxiwaysService.name);

  constructor(
    @InjectModel(Taxiway.name)
    private readonly taxiwayModel: Model<TaxiwayDocument>,
  ) {}

  async create(createtaxiwayDto: CreateTaxiwayDto) {
    try {
      const taxiway = new this.taxiwayModel(createtaxiwayDto);
      await taxiway.save();

      return {
        Status: 200,
        Message: 'Success',
        Payload: taxiway,
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

      const taxiways = await this.taxiwayModel
        .find(mongooseFilters)
        .sort({ _timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      const total = await this.taxiwayModel
        .countDocuments(mongooseFilters)
        .exec();

      return {
        Status: 200,
        Message: 'Success',
        Payload: {
          results: taxiways,
          total,
          page,
          limit,
        },
      };
    } catch (error) {
      return {
        Status: error.status || 500,
        Message: error.message || 'An error occurred while fetching taxiways',
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

    return mongooseFilters;
  }

  async findOne(id: string) {
    try {
      const taxiway = await this.taxiwayModel.findOne({ _id: id }).exec();
      if (!taxiway) {
        throw new HttpException('taxiway not found', HttpStatus.NOT_FOUND);
      }

      return {
        Status: 200,
        Message: 'Success',
        Payload: taxiway,
      };
    } catch (error) {
      console.error('Failed to update taxiway:', error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.http_code || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updatetaxiwayDto: UpdateTaxiwayDto) {
    try {
      const taxiway = await this.taxiwayModel
        .findOneAndUpdate({ _id: id }, updatetaxiwayDto, { new: true })
        .exec();

      if (!taxiway) {
        throw new HttpException('taxiway not found', HttpStatus.NOT_FOUND);
      }

      return {
        Status: 200,
        Message: 'Success',
        Payload: taxiway,
      };
    } catch (error) {
      console.error('Failed to update taxiway:', error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.http_code || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      const taxiway = await this.taxiwayModel
        .findOneAndDelete({ _id: id })
        .exec();

      if (!taxiway) {
        throw new HttpException('taxiway not found', HttpStatus.NOT_FOUND);
      }

      return {
        Status: 200,
        Message: 'Success',
        Payload: { id },
      };
    } catch (error) {
      console.error('Failed to delete taxiway:', error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.http_code || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
