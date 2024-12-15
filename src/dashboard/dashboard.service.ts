import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Airport } from 'src/airports/entities/airport.entity';
import { AirportDocument } from 'src/airports/schemas/airport.schema';
import { UserRole } from 'src/enums/user.roles.enums';
import {
  Inspection,
  InspectionDocument,
} from 'src/inspections/schemas/inspection.schema';
import { Issue, IssueDocument } from 'src/issues/schemas/issues.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Airport.name)
    private readonly airportModel: Model<AirportDocument>,
    @InjectModel(Inspection.name)
    private readonly inspectionModel: Model<InspectionDocument>,
    @InjectModel(Issue.name)
    private readonly issueModel: Model<IssueDocument>,
    @InjectModel(User.name)
    private readonly usersModel: Model<UserDocument>,
  ) {}

  async getSummary() {
    try {
      const users = await this.usersModel.countDocuments();
      const airports = await this.airportModel.countDocuments();
      const inspections = await this.inspectionModel.countDocuments();
      const issues = await this.issueModel.countDocuments();

      return {
        Status: 200,
        Message: 'Success',
        Payload: {
          users,
          airports,
          inspections,
          issues,
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

  async getUsersStats() {
    try {
      const results = await this.usersModel.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            role: '$_id',
            count: 1,
            _id: 0,
          },
        },
      ]);

      const roleCounts: Record<UserRole, number> = {
        [UserRole.Inspector]: 0,
        [UserRole.Supervisor]: 0,
        [UserRole.Admin]: 0,
      };

      results.forEach((result) => {
        roleCounts[result.role as UserRole] = result.count;
      });

      return {
        Status: 200,
        Message: 'Success',
        Payload: roleCounts,
      };
    } catch (error) {
      return {
        Status: error.status || 500,
        Message: error.message || 'An error occurred while fetching aiports',
        Payload: null,
      };
    }
  }

  async getInspectionsStats() {
    try {
      const results = await this.inspectionModel.aggregate([
        {
          $group: {
            _id: '$isComplete',
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            isComplete: '$_id',
            count: 1,
            _id: 0,
          },
        },
      ]);

      // Structure the response for completed and incomplete inspections
      const inspectionCounts = {
        completed: 0,
        incomplete: 0,
      };

      results.forEach((result) => {
        if (result.isComplete) {
          inspectionCounts.completed = result.count;
        } else {
          inspectionCounts.incomplete = result.count;
        }
      });

      return {
        Status: 200,
        Message: 'Success',
        Payload: inspectionCounts,
      };
    } catch (error) {
      return {
        Status: error.status || 500,
        Message:
          error.message ||
          'An error occurred while fetching inspections statistics',
        Payload: null,
      };
    }
  }

  async getIssuesStats() {
    try {
      const results = await this.issueModel.aggregate([
        {
          $group: {
            _id: '$isResolved', // Group by the isResolved field
            count: { $sum: 1 }, // Count the number of documents in each group
          },
        },
        {
          $project: {
            isResolved: '$_id', // Rename _id to isResolved
            count: 1, // Include the count field
            _id: 0, // Exclude the original _id field
          },
        },
      ]);

      // Initialize counts for resolved and unresolved issues
      const issueCounts = {
        resolved: 0,
        unresolved: 0,
      };

      // Populate the counts based on aggregation results
      results.forEach((result) => {
        if (result.isResolved) {
          issueCounts.resolved = result.count;
        } else {
          issueCounts.unresolved = result.count;
        }
      });

      // Return a structured response
      return {
        Status: 200,
        Message: 'Success',
        Payload: issueCounts,
      };
    } catch (error) {
      // Handle errors gracefully
      return {
        Status: error.status || 500,
        Message:
          error.message || 'An error occurred while fetching issue statistics',
        Payload: null,
      };
    }
  }
}
