import prisma from '../prisma';
import { IBaseRepository } from '../../types/repository';

export class BaseRepository<T> implements IBaseRepository<T> {
  protected modelName: string;

  constructor(modelName: string) {
    this.modelName = modelName;
  }

  protected get model(): any {
    return (prisma as any)[this.modelName];
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({
      where: { id },
    });
  }

  async findMany(filter?: Record<string, any>): Promise<T[]> {
    return this.model.findMany({
      where: filter,
    });
  }

  async create(data: any, ...args: any[]): Promise<T> {
    return this.model.create({
      data,
    });
  }

  async update(id: string, data: Record<string, any>): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<T> {
    return this.model.delete({
      where: { id },
    });
  }
}
