import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Runway, RunwayDocument } from 'src/runways/schemas/runway.schema';
import { Taxiway, TaxiwayDocument } from 'src/taxiways/schemas/taxiway.schema';
import { CreateAirportDto } from './dto/create-airport.dto';
import { UpdateAirportDto } from './dto/update-airport.dto';
import { Airport } from './entities/airport.entity';
import { AirportDocument } from './schemas/airport.schema';

@Injectable()
export class AirportsService {
  private readonly logger = new Logger(AirportsService.name);

  constructor(
    @InjectModel(Airport.name)
    private readonly airportModel: Model<AirportDocument>,
    @InjectModel(Runway.name)
    private readonly runwayModel: Model<RunwayDocument>,
    @InjectModel(Taxiway.name)
    private readonly taxiwayModel: Model<TaxiwayDocument>,
  ) {}

  async create(createairportDto: CreateAirportDto) {
    try {
      const airport = new this.airportModel(createairportDto);
      await airport.save();

      return {
        Status: 200,
        Message: 'Success',
        Payload: airport,
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
            { name: searchRegex },
            { email: searchRegex },
            { phoneNumber: searchRegex },
            { postalCode: searchRegex },
            { postalAddress: searchRegex },
            { physicalAddress: searchRegex },
          ],
        };
        mongooseFilters['$or'] = [
          ...(mongooseFilters['$or'] || []),
          ...searchFilters['$or'],
        ];
      }

      const aiports = await this.airportModel
        .find(mongooseFilters)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      const total = await this.airportModel
        .countDocuments(mongooseFilters)
        .exec();

      return {
        Status: 200,
        Message: 'Success',
        Payload: {
          results: aiports,
          total,
          page,
          limit,
        },
      };
    } catch (error) {
      return {
        Status: error.status || 500,
        Message: error.message || 'An error occurred while fetching aiports',
        Payload: null,
      };
    }
  }

  private createFilters(filters: any): any {
    const mongooseFilters: any = {};

    const stringFilters = [
      'firstName',
      'lastName',
      'idNumber',
      'role',
      'email',
      'phoneNumber',
    ].sort();
    stringFilters.forEach((field) => {
      if (filters[field]) {
        mongooseFilters[field] = { $regex: filters[field], $options: 'i' };
      }
    });

    return mongooseFilters;
  }

  async findRunways(airportId: string, query: any) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        number,
        surfaceType,
        inService,
      } = query;

      // Construct the filter object with airportId as the main filter
      const filter: any = { airportId };

      // Apply additional filters from query params
      if (number) filter.number = number;
      if (surfaceType) filter.surfaceType = surfaceType;
      if (inService !== undefined) filter.inService = inService;

      if (search) {
        const searchRegex = { $regex: search, $options: 'i' };
        const searchFilters = {
          $or: [{ number: searchRegex }, { surfaceType: searchRegex }],
        };
        filter['$or'] = [...(filter['$or'] || []), ...searchFilters['$or']];
      }

      // Set up pagination variables
      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(limit, 10);
      const skip = (pageNumber - 1) * pageSize;

      // Fetch runways with filtering and pagination
      const [runways, total] = await Promise.all([
        this.runwayModel.find(filter).skip(skip).limit(pageSize).exec(),
        this.runwayModel.countDocuments(filter).exec(),
      ]);

      // Return paginated and filtered results
      return {
        Status: 200,
        Message: 'Success',
        Payload: {
          results: runways,
          total,
          page: pageNumber,
          limit: pageSize,
        },
      };
    } catch (error) {
      console.error('Failed to find runways:', error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.http_code || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findTaxiways(airportId: string, query: any) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        number,
        surfaceType,
        inService,
      } = query;

      // Construct the filter object with airportId as the main filter
      const filter: any = { airportId };

      // Apply additional filters from query params
      if (number) filter.number = number;
      if (surfaceType) filter.surfaceType = surfaceType;
      if (inService !== undefined) filter.inService = inService;

      if (search) {
        const searchRegex = { $regex: search, $options: 'i' };
        const searchFilters = {
          $or: [{ number: searchRegex }, { surfaceType: searchRegex }],
        };
        filter['$or'] = [...(filter['$or'] || []), ...searchFilters['$or']];
      }

      // Set up pagination variables
      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(limit, 10);
      const skip = (pageNumber - 1) * pageSize;

      // Fetch taxiways with filtering and pagination
      const [taxiways, total] = await Promise.all([
        this.taxiwayModel.find(filter).skip(skip).limit(pageSize).exec(),
        this.taxiwayModel.countDocuments(filter).exec(),
      ]);

      // Return paginated and filtered results
      return {
        Status: 200,
        Message: 'Success',
        Payload: {
          results: taxiways,
          total,
          page: pageNumber,
          limit: pageSize,
        },
      };
    } catch (error) {
      console.error('Failed to find taxiways:', error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.http_code || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const airport = await this.airportModel.findOne({ _id: id }).exec();
      if (!airport) {
        throw new HttpException('airport not found', HttpStatus.NOT_FOUND);
      }

      return {
        Status: 200,
        Message: 'Success',
        Payload: airport,
      };
    } catch (error) {
      console.error('Failed to fetch airport:', error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.http_code || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateairportDto: UpdateAirportDto) {
    try {
      const airport = await this.airportModel
        .findOneAndUpdate({ _id: id }, updateairportDto, { new: true })
        .exec();

      if (!airport) {
        throw new HttpException('airport not found', HttpStatus.NOT_FOUND);
      }

      return {
        Status: 200,
        Message: 'Success',
        Payload: airport,
      };
    } catch (error) {
      console.error('Failed to update airport:', error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.http_code || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      const airport = await this.airportModel
        .findOneAndDelete({ _id: id })
        .exec();

      if (!airport) {
        throw new HttpException('airport not found', HttpStatus.NOT_FOUND);
      }

      return {
        Status: 200,
        Message: 'Success',
        Payload: { id },
      };
    } catch (error) {
      console.error('Failed to delete airport:', error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.http_code || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
