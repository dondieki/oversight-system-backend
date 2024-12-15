import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class DownloadReportDto {
  @IsNotEmpty()
  @IsString()
  endDate: string;

  @IsNotEmpty()
  @IsString()
  sendTo: string;

  @IsNotEmpty()
  @IsString()
  entity: string;

  @IsNotEmpty()
  @IsString()
  startDate: string;

  @IsNotEmpty()
  @IsBoolean()
  status: boolean | string;
}
