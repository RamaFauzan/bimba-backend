import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
  @IsNumber()
  unitId: number;

  @IsOptional()
  @IsString()
  parentName?: string;

  @IsString()
  @IsNotEmpty()
  studentName: string;

  @IsOptional()
  @IsString()
  stageType?: 'P' | 'L' | 'K';

  @IsOptional()
  @IsString()
  program?: string;

  @IsOptional()
  @IsNumber()
  monthlyFee?: number;

  @IsOptional()
  @IsNumber()
  attendanceTotal?: number;

  @IsOptional()
  @IsString()
  progressCode?: string;
}
