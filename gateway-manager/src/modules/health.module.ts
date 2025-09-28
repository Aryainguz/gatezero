import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HealthController } from '../controllers/health.controller';
import { HealthService } from '../services/health.service';
import { HealthRepository } from '../repositories/health.repository';
import { Health, HealthSchema } from '../schemas/health.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Health.name, schema: HealthSchema }]),
  ],
  controllers: [HealthController],
  providers: [HealthService, HealthRepository],
  exports: [HealthService],
})
export class HealthModule {}