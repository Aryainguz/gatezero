import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Health, HealthDocument } from '../schemas/health.schema';

@Injectable()
export class HealthRepository {
  constructor(
    @InjectModel(Health.name) private healthModel: Model<HealthDocument>,
  ) {}

  async create(healthData: Partial<Health>): Promise<Health> {
    const createdHealth = new this.healthModel(healthData);
    return createdHealth.save();
  }

  async findLatest(service: string): Promise<Health | null> {
    return this.healthModel
      .findOne({ service })
      .sort({ timestamp: -1 })
      .exec();
  }
}