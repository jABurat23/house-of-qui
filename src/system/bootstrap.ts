import { logger, logSystemStart } from "../core/logger"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "../app.module"
import { PackagesService } from "./packages/packages.service"

export async function bootstrap() {
  logSystemStart()

  // Create and start NestJS app on port 4000
  const app = await NestFactory.create(AppModule, { logger: false })

  // Enable CORS
  app.enableCors({
    origin: /^http:\/\/localhost(:\d+)?$/,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  })

  await app.listen(4000, () => {
    logger.monarch("Imperial API core active on port 4000.");
  })

  // Seed packages
  const packagesService = app.get(PackagesService);
  await packagesService.seedPackages();
  logger.logistics("Imperial library archives synchronized.");

  logger.system("Subsystem protocols: NORMALIZED");
}