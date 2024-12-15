import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { Password, PasswordDocument } from './schemas/password.schema';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Password.name) private passwordModel: Model<PasswordDocument>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findAll(query: any) {
    try {
      const { page = 1, limit = 10, search, ...filters } = query;
      const mongooseFilters = this.createFilters(filters);

      if (search) {
        const searchRegex = { $regex: search, $options: 'i' };
        const searchFilters = {
          $or: [
            { firstName: searchRegex },
            { lastName: searchRegex },
            { email: searchRegex },
            { idNumber: searchRegex },
            { phoneNumber: searchRegex },
          ],
        };
        mongooseFilters['$or'] = [
          ...(mongooseFilters['$or'] || []),
          ...searchFilters['$or'],
        ];
      }

      const users = await this.userModel
        .find(mongooseFilters)
        .sort({ _timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      const total = await this.userModel.countDocuments(mongooseFilters).exec();

      return {
        Status: 200,
        Message: 'Success',
        Payload: {
          results: users,
          total,
          page,
          limit,
        },
      };
    } catch (error) {
      return {
        Status: error.status || 500,
        Message: error.message || 'An error occurred while fetching users',
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

  async findOne(id: string) {
    const user = await this.userModel.findOne({ _id: id }).exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return {
      Status: HttpStatus.OK,
      Message: 'Success',
      Payload: user,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findByIdAndUpdate(
      id,
      { ...updateUserDto, _utimestamp: Date.now() },
      { new: true, runValidators: true },
    );

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return {
      Status: HttpStatus.OK,
      Message: 'Success',
      Payload: user,
    };
  }

  async remove(id: string) {
    // Find and delete the user
    const user = await this.userModel.findByIdAndDelete(id);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    // Find and delete the associated password entry
    const passwordEntry = await this.passwordModel.findOneAndDelete({
      userId: user._id,
    });

    // Optional: Handle case if the password entry was not found (e.g., log or return a specific message)
    if (!passwordEntry) {
      this.logger.warn(`Password entry for user ${id} not found`);
    }

    return {
      Status: 200,
      Message: 'User and associated password removed successfully',
      Payload: null,
    };
  }

  async getTotalUsers() {
    console.log(this.userModel.countDocuments().exec());
    return;
    return {
      Status: 200,
      Message: 'Success',
      Payload: {
        users: this.userModel.countDocuments(),
      },
    };
  }
}
