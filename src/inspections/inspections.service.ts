import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as ExcelJS from 'exceljs';
import { Model } from 'mongoose';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { DownloadReportDto } from './dto/download-report.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { Inspection } from './entities/inspection.entity';
import { InspectionDocument } from './schemas/inspection.schema';

@Injectable()
export class InspectionsService {
  constructor(
    @InjectModel(Inspection.name)
    private readonly inspectionModel: Model<InspectionDocument>,
    private readonly mailerService: MailerService,
  ) {}

  async create(createinspectionDto: CreateInspectionDto) {
    try {
      const inspection = new this.inspectionModel(createinspectionDto);
      await inspection.save();

      return {
        Status: 200,
        Message: 'Success',
        Payload: inspection,
      };
    } catch (error) {
      if (error.code === 11000) {
        console.error('Duplicate key error details:', error);
        return {
          Status: 400,
          Message: 'Duplicate key error',
          Payload: null,
        };
      } else if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(
          (err: any) => err.message,
        );

        return {
          Status: 400,
          Message: 'Validation Error',
          Payload: errors,
        };
      }

      return {
        Status: error.status,
        Message: error.message,
        Payload: null,
      };
    }
  }

  async findAll(query: Record<string, any>) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        startDate,
        endDate,
        ...filters
      } = query;

      // Create filters for MongoDB
      const mongooseFilters = this.createFilters(filters);

      // Add global search logic
      if (search) {
        mongooseFilters.$or = this.createSearchFilters(search);
      }

      // Add date range filter
      if (startDate || endDate) {
        mongooseFilters._timestamp = {};
        if (startDate) mongooseFilters._timestamp.$gte = new Date(startDate);
        if (endDate) mongooseFilters._timestamp.$lte = new Date(endDate);
      }

      // Fetch data with pagination and sorting
      const inspections = await this.inspectionModel
        .find(mongooseFilters)
        .populate('inspectorId', 'firstName lastName email phoneNumber')
        .populate(
          'airportId',
          'name email phoneNumber postalAddress physicalAddress',
        )
        .populate('airlineId', 'name numberOfAircraft totalPassengers')
        .populate('ansStationId', 'name services')
        .populate('maintenanceOrgId', 'name location aircraftTypes')
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .sort({ createdAt: -1 })
        .exec();

      // Count total matching documents
      const total = await this.inspectionModel
        .countDocuments(mongooseFilters)
        .exec();

      return {
        Status: 200,
        Message: 'Success',
        Payload: {
          results: inspections,
          total,
          page: Number(page),
          limit: Number(limit),
        },
      };
    } catch (error) {
      console.error('Error in findAll:', error);
      return {
        Status: error.status || 500,
        Message:
          error.message || 'An error occurred while fetching inspections',
        Payload: null,
      };
    }
  }

  private createFilters(filters: Record<string, any>): Record<string, any> {
    const mongooseFilters: Record<string, any> = {};

    // Dynamic filters for specific fields
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        mongooseFilters[key] = value;
      }
    });

    return mongooseFilters;
  }

  private createSearchFilters(search: string): Record<string, any>[] {
    const searchRegex = { $regex: search, $options: 'i' };

    return [
      { 'airportId.name': searchRegex },
      { 'airportId.email': searchRegex },
      { 'airportId.phoneNumber': searchRegex },
      { 'inspectorId.email': searchRegex },
      { 'inspectorId.firstName': searchRegex },
      { 'inspectorId.lastName': searchRegex },
      { 'inspectorId.phoneNumber': searchRegex },
      { 'inspectorId.idNumber': searchRegex },
    ];
  }

  async findOne(id: string) {
    try {
      const inspection = await this.inspectionModel
        .findOne({ _id: id })
        .populate('inspectorId', 'firstName lastName email phoneNumber')
        .populate(
          'airportId',
          'name email phoneNumber postalCode postalAddress physicalAddress',
        )
        .populate('airlineId', 'name numberOfAircraft totalPassengers')
        .populate('ansStationId', 'name services')
        .populate('maintenanceOrgId', 'name location aircraftTypes')
        .exec();
      if (!inspection) {
        throw new HttpException('inspection not found', HttpStatus.NOT_FOUND);
      }

      return {
        Status: 200,
        Message: 'Success',
        Payload: inspection,
      };
    } catch (error) {
      console.error('Failed to update inspection:', error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.http_code || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateinspectionDto: UpdateInspectionDto) {
    try {
      const inspection = await this.inspectionModel
        .findOneAndUpdate({ _id: id }, updateinspectionDto, { new: true })
        .exec();

      if (!inspection) {
        throw new HttpException('inspection not found', HttpStatus.NOT_FOUND);
      }

      return {
        Status: 200,
        Message: 'Success',
        Payload: inspection,
      };
    } catch (error) {
      console.error('Failed to update inspection:', error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.http_code || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      const inspection = await this.inspectionModel
        .findOneAndDelete({ _id: id })
        .exec();

      if (!inspection) {
        throw new HttpException('inspection not found', HttpStatus.NOT_FOUND);
      }

      return {
        Status: 200,
        Message: 'Success',
        Payload: { id },
      };
    } catch (error) {
      console.error('Failed to delete inspection:', error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.http_code || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async downloadReport(downloadReportDto: DownloadReportDto) {
    const { sendTo, status, startDate, endDate } = downloadReportDto;

    const inspections = await this.inspectionModel.find({
      isComplete: status,
      _timestamp: {
        $gte: new Date(startDate).getTime(),
        $lte: new Date(endDate).getTime(),
      },
    });

    // Generate Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Inspections');

    worksheet.columns = [
      { header: 'Airport ID', key: 'airportId', width: 20 },
      { header: 'Inspector ID', key: 'inspectorId', width: 20 },
      { header: 'Is Complete', key: 'isComplete', width: 15 },
      { header: 'Deadline', key: '_deadline', width: 20 },
      { header: 'Timestamp', key: '_timestamp', width: 20 },
    ];

    inspections.forEach((inspection) => {
      worksheet.addRow({
        airportId: inspection.airportId,
        inspectorId: inspection.inspectorId,
        isComplete: inspection.isComplete,
        _deadline: new Date(inspection._deadline).toLocaleString(),
        _timestamp: new Date(inspection._timestamp).toLocaleString(),
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    await this.mailerService.sendMail({
      to: sendTo,
      subject: 'Inspections Report',
      attachments: [
        {
          filename: 'inspection-report.xlsx',
          content: buffer,
        },
      ],
    });
    return { message: 'Report sent successfully' };
  }
}
