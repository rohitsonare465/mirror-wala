import prisma from '../prisma';
import { BaseRepository } from './base.repository';
import { IEnquiryRepository } from '../../types/repository';

export class EnquiryRepository extends BaseRepository<any> implements IEnquiryRepository {
  constructor() {
    super('enquiry');
  }

  override async findMany(filters?: {
    status?: string;
    type?: string;
  }): Promise<any[]> {
    const where: any = {};
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.type) {
      where.type = filters.type;
    }

    return prisma.enquiry.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: any, adminNotes?: string): Promise<any> {
    const data: any = { status };
    if (adminNotes) {
      data.adminNotes = adminNotes;
    }

    return prisma.enquiry.update({
      where: { id },
      data,
    });
  }
}
