import { logger, logSystemStart } from "../core/logger"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "../app.module"
import { PackagesService } from "./packages/packages.service"
import { AuditService } from "./audit/audit.service"
import { MonarchService } from "../monarch/monarch.service"
import { ScribeService } from "../monarch/scribe/scribe.service"
import { CommandService } from "../modules/command/command.service"

export async function bootstrap() {
  logSystemStart()

  // Create and start NestJS app on port 4000
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] })

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

  // Initiate System Diagnostics & Core Seed
  const auditService = app.get(AuditService);
  const monarchService = app.get(MonarchService);
  const scribeService = app.get(ScribeService);
  const commandService = app.get(CommandService);

  const projects = await monarchService.getAllProjects();
  if (projects.length === 0) {
    logger.system("Allocating primitive foundations...");
    try {
      const core = await monarchService.createProject(
        "Sovereign Core",
        "Primary architectural foundation of House of Qui.",
        "KEY_0x1A2B3C"
      );
      await scribeService.generateChronicle(core.id);
      await commandService.executeRemoteCommand(core.id, "system:diagnostics", { auto: true });
      await commandService.executeRemoteCommand(core.id, "network:scan", { deep: false });
      
      await auditService.recordAction({
        action: "CORE_BOOTSTRAPPED",
        actor: "IMPERIAL_DAEMON",
        targetId: core.id,
        metadata: { status: "Online and analyzing topology", version: "2.0.4" },
        level: "critical"
      });
      logger.monarch("Sovereign Core constructed.");
    } catch (e) {
      logger.error("Core injection failed.", e);
    }
  } else {
    // Generate organic diagnostics for existing projects so UI is strictly populated with real data
    try {
      const core = projects[0];
      await commandService.executeRemoteCommand(core.id, "system:diagnostics", { auto: true });
      await scribeService.generateChronicle(core.id);
      
      await auditService.recordAction({
        action: "SYSTEM_BOOT",
        actor: "IMPERIAL_DAEMON",
        targetId: core.id,
        metadata: { message: "System core allocated successfully.", boot: true },
        level: "info"
      });
    } catch (e) {}
  }

  logger.system("Subsystem protocols: NORMALIZED");
}