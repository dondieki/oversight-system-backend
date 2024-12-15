import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Airport } from 'src/airports/entities/airport.entity';
import { User } from 'src/users/schemas/user.schema';

export class UpdateInspectionDto {
  @IsOptional()
  @IsString()
  airportId: string;

  @IsOptional()
  airlineId: string;

  @IsOptional()
  ansStationId: string;

  @IsOptional()
  maintenanceOrgId: string;

  @IsOptional()
  airport: Airport;

  @IsOptional()
  @IsString()
  inspectorId: string;

  @IsOptional()
  inspector: User;

  @IsOptional()
  @IsBoolean()
  isComplete: boolean;

  _deadline: number;
}
