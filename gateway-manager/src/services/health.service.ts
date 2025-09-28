import { Injectable, Logger } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { HealthRepository } from "../repositories/health.repository";

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly healthRepository: HealthRepository
  ) {}

  async checkHealth(): Promise<{
    status: string;
    timestamp: string;
    database: string;
    uptime: number;
  }> {
    try {
      const dbStatus =
        this.connection.readyState === 1 ? "connected" : "disconnected";

      await this.healthRepository.create({
        service: "gateway-service",
        status: "healthy",
        timestamp: new Date(),
        details: {
          database: dbStatus,
          uptime: process.uptime(),
        },
      });

      return {
        status: "healthy",
        timestamp: new Date().toISOString(),
        database: dbStatus,
        uptime: Math.floor(process.uptime()),
      };
    } catch (error) {
      this.logger.error("Health check failed:", error);
      throw error;
    }
  }
}
