import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMaintenanceOrganizationDto } from './dto/create-maintenance-organization.dto';
import { UpdateMaintenanceOrganizationDto } from './dto/update-maintenance-organization.dto';
import {
  MaintenanceOrganization,
  MaintenanceOrganizationDocument,
} from './schemas/maintenance-origanisation.schema';

@Injectable()
export class MaintenanceOrganizationsService {
  private readonly logger = new Logger(MaintenanceOrganizationsService.name);

  constructor(
    @InjectModel(MaintenanceOrganization.name)
    private readonly maintenanceOrganizationModel: Model<MaintenanceOrganizationDocument>,
  ) {}

  async create(createDto: CreateMaintenanceOrganizationDto) {
    try {
      const organization = new this.maintenanceOrganizationModel(createDto);
      await organization.save();

      return {
        Status: 200,
        Message: 'Success',
        Payload: organization,
      };
    } catch (error) {
      this.logger.error('Error adding maintenance organization:', error);
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
          { location: searchRegex },
        ];
      }

      const organizations = await this.maintenanceOrganizationModel
        .find(mongooseFilters)
        .sort({ _timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      const total = await this.maintenanceOrganizationModel
        .countDocuments(mongooseFilters)
        .exec();

      return {
        Status: 200,
        Message: 'Success',
        Payload: {
          results: organizations,
          total,
          page,
          limit,
        },
      };
    } catch (error) {
      this.logger.error('Error fetching maintenance organizations:', error);
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
    const stringFilters = ['name', 'licenseNumber', 'address'].sort();
    stringFilters.forEach((field) => {
      if (filters[field]) {
        mongooseFilters[field] = { $regex: filters[field], $options: 'i' };
      }
    });

    return mongooseFilters;
  }

  async findOne(id: string) {
    try {
      const organization = await this.maintenanceOrganizationModel
        .findOne({ _id: id })
        .exec();
      if (!organization) {
        throw new HttpException(
          'Maintenance organization not found',
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        Status: 200,
        Message: 'Success',
        Payload: organization,
      };
    } catch (error) {
      this.logger.error('Error fetching maintenance organization:', error);
      throw new HttpException(
        {
          Status: error.status || 500,
          Message: error.message || 'Internal Server Error',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateDto: UpdateMaintenanceOrganizationDto) {
    try {
      const organization = await this.maintenanceOrganizationModel
        .findOneAndUpdate({ _id: id }, updateDto, { new: true })
        .exec();

      if (!organization) {
        throw new HttpException(
          'Maintenance organization not found',
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        Status: 200,
        Message: 'Success',
        Payload: organization,
      };
    } catch (error) {
      this.logger.error('Error updating maintenance organization:', error);
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
      const organization = await this.maintenanceOrganizationModel
        .findOneAndDelete({ _id: id })
        .exec();

      if (!organization) {
        throw new HttpException(
          'Maintenance organization not found',
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        Status: 200,
        Message: 'Success',
        Payload: { id },
      };
    } catch (error) {
      this.logger.error('Error deleting maintenance organization:', error);
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
