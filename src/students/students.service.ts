/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Students } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

type StudentListItem = Prisma.StudentsGetPayload<{
  include: {
    unit: true;
    progress: {
      include: {
        category: true;
        currentModule: true;
      };
    };
  };
}>;

type StudentDetails = Prisma.StudentsGetPayload<{
  include: {
    unit: true;
    progress: {
      include: {
        category: true;
        currentModule: true;
        nextModule: true;
      };
    };
    homeworks: {
      include: {
        items: {
          include: {
            category: true;
            module: true;
          };
        };
      };
    };
  };
}>;

@Injectable()
export class StudentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateStudentDto): Promise<Students> {
    return await this.prisma.students.create({
      data: {
        unitId: BigInt(dto.unitId),
        parentName: dto.parentName,
        studentName: dto.studentName,
        stageType: dto.stageType,
        stageName: this.getStageName(dto.stageType),
        program: dto.program,
        monthlyFee: dto.monthlyFee,
        attendanceTotal: dto.attendanceTotal,
        progressCode: dto.progressCode,
      },
    });
  }

  async findAll(query: PaginationDto & { unitId?: number }): Promise<{
    data: StudentListItem[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
    };
  }> {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);
    const skip = (page - 1) * limit;

    const where: any = {
      ...(query.unitId && { unitId: BigInt(query.unitId) }),
      ...(query.search && {
        OR: [
          { studentName: { contains: query.search, mode: 'insensitive' } },
          { parentName: { contains: query.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.students.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          unit: true,
          progress: {
            include: {
              category: true,
              currentModule: true,
            },
          },
        },
      }),
      this.prisma.students.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<StudentDetails> {
    const student = await this.prisma.students.findUnique({
      where: { id: BigInt(id) },
      include: {
        unit: true,
        progress: {
          include: {
            category: true,
            currentModule: true,
            nextModule: true,
          },
        },
        homeworks: {
          include: {
            items: {
              include: {
                category: true,
                module: true,
              },
            },
          },
        },
      },
    });

    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  private getStageName(code?: string) {
    const map = {
      P: 'Pengenalan',
      L: 'Pelatihan',
      K: 'Kemandirian',
    };

    return code ? map[code] : null;
  }
}
