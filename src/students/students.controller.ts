/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  apiCreated,
  apiError,
  apiSuccess,
} from 'src/common/helpers/response.helper';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  async create(@Body() dto: CreateStudentDto) {
    try {
      const student = await this.studentsService.create(dto);
      return apiCreated(student, 'Student created');
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        apiError('Failed to create student', error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll(@Query() query: PaginationDto & { unitId?: number }) {
    try {
      const result = await this.studentsService.findAll(query);
      return apiSuccess(result.data, 'Students fetched', result.meta);
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        apiError('Failed to fetch students', error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const student = await this.studentsService.findOne(Number(id));
      return apiSuccess(student, 'Student fetched');
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        apiError('Failed to fetch student', error),
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
