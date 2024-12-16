import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { createTransport } from 'nodemailer';
import * as path from 'path';
import { AirportsService } from 'src/airports/airports.service';
import { Airport } from 'src/airports/entities/airport.entity';
import { AirportDocument } from 'src/airports/schemas/airport.schema';
import { DownloadReportDto } from 'src/inspections/dto/download-report.dto';
import { Runway, RunwayDocument } from 'src/runways/schemas/runway.schema';
import { Taxiway, TaxiwayDocument } from 'src/taxiways/schemas/taxiway.schema';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { Issue, IssueDocument } from './schemas/issues.schema';

@Injectable()
export class IssuesService {
  private readonly logger = new Logger(AirportsService.name);

  constructor(
    @InjectModel(Issue.name)
    private readonly issueModel: Model<IssueDocument>,
    @InjectModel(Airport.name)
    private readonly airportModel: Model<AirportDocument>,
    @InjectModel(Runway.name)
    private readonly runwayModel: Model<RunwayDocument>,
    @InjectModel(Taxiway.name)
    private readonly taxiwayModel: Model<TaxiwayDocument>,
  ) {}

  async create(createIssueDto: CreateIssueDto) {
    try {
      const issue = new this.issueModel(createIssueDto);
      await issue.save();

      return {
        Status: 200,
        Message: 'Success',
        Payload: issue,
      };
    } catch (error) {
      this.logger.error('Error adding issue:', error);
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
      const {
        page = 1,
        limit = 10,
        search,
        startDate,
        endDate,
        ...filters
      } = query;

      const mongooseFilters = this.createFilters(filters);

      if (search) {
        const searchRegex = { $regex: search, $options: 'i' };
        const searchFilters = {
          $or: [{ inspectionType: searchRegex }],
        };
        mongooseFilters['$or'] = [
          ...(mongooseFilters['$or'] || []),
          ...searchFilters['$or'],
        ];
      }

      if (startDate || endDate) {
        mongooseFilters._timestamp = {};
        if (startDate) mongooseFilters._timestamp.$gte = new Date(startDate);
        if (endDate) mongooseFilters._timestamp.$lte = new Date(endDate);
      }

      const issues = await this.issueModel
        .find(mongooseFilters)
        .populate('runwayId', 'number')
        .populate('taxiwayId', 'number')
        .populate(
          'airportId',
          'name email phoneNumber postalAddress physicalAddress',
        )
        .populate('airlineId', 'name numberOfAircraft totalPassengers')
        .populate('ansStationId', 'name services')
        .populate('maintenanceOrgId', 'name location aircraftTypes')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      const total = await this.issueModel
        .countDocuments(mongooseFilters)
        .exec();

      return {
        Status: 200,
        Message: 'Success',
        Payload: {
          results: issues,
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

  async findRunways(issueId: string, query: any) {
    try {
      const { page = 1, limit = 10, number, surfaceType, inService } = query;

      // Construct the filter object with issueId as the main filter
      const filter: any = { issueId };

      // Apply additional filters from query params
      if (number) filter.number = number;
      if (surfaceType) filter.surfaceType = surfaceType;
      if (inService !== undefined) filter.inService = inService;

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
      const { page = 1, limit = 10, number, surfaceType, inService } = query;

      // Construct the filter object with airportId as the main filter
      const filter: any = { airportId };

      // Apply additional filters from query params
      if (number) filter.number = number;
      if (surfaceType) filter.surfaceType = surfaceType;
      if (inService !== undefined) filter.inService = inService;

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
      const issue = await this.issueModel
        .findOne({ _id: id })
        .populate('runwayId', 'number')
        .populate('taxiwayId', 'number')
        .populate(
          'airportId',
          'name email phoneNumber postalAddress physicalAddress',
        )
        .populate('airlineId', 'name numberOfAircraft totalPassengers')
        .populate('ansStationId', 'name services')
        .populate('maintenanceOrgId', 'name location aircraftTypes')
        .exec();
      if (!issue) {
        throw new HttpException('issue not found', HttpStatus.NOT_FOUND);
      }

      return {
        Status: 200,
        Message: 'Success',
        Payload: issue,
      };
    } catch (error) {
      console.error('Failed to fetch issue:', error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.http_code || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateIssueDto: UpdateIssueDto) {
    try {
      const issue = await this.issueModel
        .findOneAndUpdate({ _id: id }, updateIssueDto, { new: true })
        .exec();

      if (!issue) {
        throw new HttpException('issue not found', HttpStatus.NOT_FOUND);
      }

      return {
        Status: 200,
        Message: 'Success',
        Payload: issue,
      };
    } catch (error) {
      console.error('Failed to update issue:', error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.http_code || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      const issue = await this.issueModel.findOneAndDelete({ _id: id }).exec();

      if (!issue) {
        throw new HttpException('issue not found', HttpStatus.NOT_FOUND);
      }

      return {
        Status: 200,
        Message: 'Success',
        Payload: { id },
      };
    } catch (error) {
      console.error('Failed to delete issue:', error);
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.http_code || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async generateAndSendExcelReport(downloadReportDto: DownloadReportDto) {
    try {
      const { sendTo, status, entity, startDate, endDate } = downloadReportDto;

      const query: any = {
        _timestamp: { $gte: new Date(startDate), $lte: new Date(endDate) },
      };

      if (status !== 'All') {
        query.isResolved = status;
      }
      if (entity !== 'All') {
        query[entity] = { $exists: true };
      }

      // Fetch data from the database and populate references
      const issues = await this.issueModel
        .find(query)
        .populate('airportId', 'name')
        .populate('runwayId', 'name')
        .populate('taxiwayId', 'name')
        .populate('airlineId', 'name code')
        .populate('ansStationId', 'name')
        .populate('maintenanceOrgId', 'name')
        .exec();

      // Create Excel workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Issues Report');

      // Define columns
      worksheet.columns = [
        { header: 'Issue ID', key: '_id', width: 25 },
        { header: 'Airport Name', key: 'airportName', width: 20 },
        { header: 'Runway Name', key: 'runwayName', width: 20 },
        { header: 'Taxiway Name', key: 'taxiwayName', width: 20 },
        { header: 'Airline Name', key: 'airlineName', width: 20 },
        { header: 'Airline Code', key: 'airlineCode', width: 10 },
        { header: 'ANS Station Name', key: 'ansStationName', width: 20 },
        {
          header: 'Maintenance Org Name',
          key: 'maintenanceOrgName',
          width: 25,
        },
        { header: 'Inspection Type', key: 'inspectionType', width: 20 },
        { header: 'Entity', key: 'entity', width: 15 },
        { header: 'Comment', key: 'comment', width: 50 },
        { header: 'Resolved', key: 'isResolved', width: 10 },
        { header: 'Timestamp', key: '_timestamp', width: 25 },
      ];

      // Add rows with data
      issues.forEach((issue) => {
        worksheet.addRow({
          _id: issue._id,
          airportName: issue.airportId?.['name'] || 'N/A',
          runwayName: issue.runwayId?.['name'] || 'N/A',
          taxiwayName: issue.taxiwayId?.['name'] || 'N/A',
          airlineName: issue.airlineId?.['name'] || 'N/A',
          airlineCode: issue.airlineId?.['code'] || 'N/A',
          ansStationName: issue.ansStationId?.['name'] || 'N/A',
          maintenanceOrgName: issue.maintenanceOrgId?.['name'] || 'N/A',
          inspectionType: issue.inspectionType,
          entity: issue.entity,
          comment: issue.comment,
          isResolved: issue.isResolved ? 'Yes' : 'No',
          _timestamp: new Date(issue._timestamp).toISOString(),
        });
      });

      // Save the file locally
      const filePath = path.join('/tmp', 'issues-report.xlsx');
      await workbook.xlsx.writeFile(filePath);

      // Send email with the report
      const transporter = createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: sendTo,
        subject: 'Issues Report',
        text: 'Please find the attached Issues Report.',
        attachments: [
          {
            filename: 'issues-report.xlsx',
            path: filePath,
          },
        ],
      };

      await transporter.sendMail(mailOptions);

      // Clean up local file
      fs.unlinkSync(filePath);

      return {
        Status: 200,
        Message: 'Success',
        Payload: 'Success',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal Server Error',
        error.http_code || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
