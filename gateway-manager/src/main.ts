import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger("Bootstrap");

  const port = configService.get("app.port");
  const environment = configService.get("app.environment");

  if (environment === "development") {
    app.enableCors();
  }

  await app.listen(port);
  logger.log(`Gateway Manager running on port ${port} in ${environment} mode`);
}

bootstrap();
